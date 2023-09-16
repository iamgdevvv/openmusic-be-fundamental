import dotenv from 'dotenv';
import Hapi from '@hapi/hapi';
import { Prisma } from '@prisma/client';
import ClientError from '@/exceptions/ClientError';
import AlbumPlugin from '@/plugin/albums';
import PrismaPlugin from '@/plugin/prisma';
import SongPlugin from '@/plugin/songs';

dotenv.config({
	path: `.env.${process.env.NODE_ENV || 'development'}`,
});

const HapiServer = async () => {
	console.time('🕓 Server startup');

	const server: Hapi.Server = Hapi.server({
		port: process.env.SERVER_PORT,
		host: process.env.HOSTNAME,
		routes: {
			cors: {
				origin: ['*'],
			},
		},
	});

	server.ext('onPreResponse', (request, h) => {
		const { response } = request;

		if (response instanceof Prisma.PrismaClientKnownRequestError) {
			let statusCode = 400;
			const resMessage = response.meta?.cause || response.message;

			if (response.code === 'P2025') {
				statusCode = 404;
			}

			const newResponse = h.response({
				status: 'fail',
				message: resMessage,
			});
			newResponse.code(statusCode);
			return newResponse;
		}

		if (response instanceof Error) {
			// penanganan client error secara internal.
			if (response instanceof ClientError) {
				const newResponse = h.response({
					status: 'fail',
					message: response.message,
				});
				newResponse.code(response.statusCode);
				return newResponse;
			}

			// mempertahankan penanganan client error oleh hapi secara native, seperti 404, etc.
			if (!response.isServer) {
				return h.continue;
			}

			// penanganan server error sesuai kebutuhan
			const newResponse = h.response({
				status: 'error',
				message: 'Terjadi kegagalan pada server kami',
			});

			newResponse.code(500);
			return newResponse;
		}

		// jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
		return h.continue;
	});

	await server.register([PrismaPlugin, AlbumPlugin, SongPlugin]);

	await server
		.start()
		.then(() => {
			console.log(`🚀 Server berhasil berjalan ${server.info.uri}`);
		})
		.catch((err) => {
			console.log(err);
		});

	process.on('unhandledRejection', async (err) => {
		await server.app.prisma.$disconnect();
		console.log(err);
		process.exit(1);
	});

	console.timeEnd('🕓 Server startup');
};

HapiServer();
