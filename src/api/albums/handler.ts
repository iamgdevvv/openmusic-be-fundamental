import Hapi from '@hapi/hapi';
import { Prisma } from '@prisma/client';
import { ZodTypeAny } from 'zod';
import { ValidatorPayloadType } from '@/types/ValidatorType';
import NotFoundError from '@/exceptions/NotFoundError';

class AlbumsHandler {
	public albumSchema;
	public albumValidator;

	constructor(schema: ZodTypeAny, validator: ValidatorPayloadType) {
		this.albumSchema = schema;
		this.albumValidator = validator;
	}

	async postAlbumHandler(request: Hapi.Request, h: Hapi.ResponseToolkit) {
		const { prisma } = request.server.app;
		const payloadAlbum = request.payload as Prisma.AlbumCreateInput;

		this.albumValidator.validatePayload(this.albumSchema, payloadAlbum);

		const createdAlbum = await prisma.album.create({
			data: payloadAlbum,
		});

		const response = h.response({
			status: 'success',
			message: 'Album berhasil ditambahkan',
			data: {
				albumId: createdAlbum.id,
			},
		});

		response.code(201);

		return response;
	}

	async getAlbumsHandler(request: Hapi.Request) {
		const { prisma } = request.server.app;

		const albums = await prisma.album.findMany({
			select: {
				id: true,
				name: true,
				year: true,
				songs: {
					select: {
						id: true,
						title: true,
						performer: true,
					},
				},
			},
		});

		return {
			status: 'success',
			data: {
				albums,
			},
		};
	}

	async getAlbumByIdHandler(request: Hapi.Request) {
		const { prisma } = request.server.app;
		const { id } = request.params;

		const album = await prisma.album.findUnique({
			where: {
				id,
			},
			select: {
				id: true,
				name: true,
				year: true,
				songs: {
					select: {
						id: true,
						title: true,
						performer: true,
					},
				},
			},
		});

		if (!album) {
			throw new NotFoundError('Album tidak ditemukan');
		}

		return {
			status: 'success',
			data: {
				album,
			},
		};
	}

	async putAlbumByIdHandler(request: Hapi.Request) {
		const { prisma } = request.server.app;
		const payloadAlbum = request.payload as Prisma.AlbumUpdateInput;

		this.albumValidator.validatePayload(this.albumSchema, payloadAlbum);

		const { id } = request.params;

		const updateAlbum = await prisma.album.update({
			where: {
				id,
			},
			data: payloadAlbum,
		});

		return {
			status: 'success',
			message: 'Album berhasil diperbarui',
			album: updateAlbum,
		};
	}

	async deleteAlbumByIdHandler(request: Hapi.Request) {
		const { prisma } = request.server.app;
		const { id } = request.params;

		const deleteAlbum = await prisma.album.delete({
			where: {
				id,
			},
		});

		return {
			status: 'success',
			message: 'Album berhasil dihapus',
			data: deleteAlbum,
		};
	}
}

export default AlbumsHandler;
