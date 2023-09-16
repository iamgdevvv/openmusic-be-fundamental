import Hapi from '@hapi/hapi';
import { Prisma } from '@prisma/client';
import { ZodTypeAny } from 'zod';
import { ValidatorPayloadType } from '@/types/ValidatorType';
import NotFoundError from '@/exceptions/NotFoundError';

class SongsHandler {
	public songSchema;
	public songValidator;

	constructor(schema: ZodTypeAny, validator: ValidatorPayloadType) {
		this.songSchema = schema;
		this.songValidator = validator;
	}

	async postSongHandler(request: Hapi.Request, h: Hapi.ResponseToolkit) {
		const { prisma } = request.server.app;
		const payloadSong = request.payload as Prisma.SongCreateInput;

		this.songValidator.validatePayload(this.songSchema, payloadSong);

		const createdSong = await prisma.song.create({
			data: payloadSong,
		});

		const response = h.response({
			status: 'success',
			message: 'Lagu berhasil ditambahkan',
			data: {
				songId: createdSong.id,
			},
		});

		response.code(201);

		return response;
	}

	async getSongsHandler(request: Hapi.Request) {
		const { prisma } = request.server.app;
		const { title, performer } = request.query;

		const songs = await prisma.song.findMany({
			where: {
				title: {
					contains: title,
					mode: 'insensitive',
				},
				performer: {
					contains: performer,
					mode: 'insensitive',
				},
			},
			select: {
				id: true,
				title: true,
				performer: true,
			},
		});

		return {
			status: 'success',
			data: {
				songs,
			},
		};
	}

	async getSongByIdHandler(request: Hapi.Request) {
		const { prisma } = request.server.app;
		const { id } = request.params;

		const song = await prisma.song.findUnique({
			where: {
				id,
			},
			select: {
				id: true,
				title: true,
				year: true,
				performer: true,
				genre: true,
				duration: true,
				albumId: true,
			},
		});

		if (!song) {
			throw new NotFoundError('Lagu tidak ditemukan');
		}

		return {
			status: 'success',
			data: {
				song,
			},
		};
	}

	async putSongByIdHandler(request: Hapi.Request) {
		const { prisma } = request.server.app;
		const payloadSong = request.payload as Prisma.SongUpdateInput;

		this.songValidator.validatePayload(this.songSchema, payloadSong);

		const { id } = request.params;

		const updateSong = await prisma.song.update({
			where: {
				id,
			},
			data: payloadSong,
		});

		return {
			status: 'success',
			message: 'Lagu berhasil diperbarui',
			song: updateSong,
		};
	}

	async deleteSongByIdHandler(request: Hapi.Request) {
		const { prisma } = request.server.app;
		const { id } = request.params;

		const deleteSong = await prisma.song.delete({
			where: {
				id,
			},
		});

		return {
			status: 'success',
			message: 'Lagu berhasil dihapus',
			data: deleteSong,
		};
	}
}

export default SongsHandler;
