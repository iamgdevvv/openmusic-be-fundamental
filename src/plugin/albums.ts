import Hapi from '@hapi/hapi';
import PayloadValidator from '@/validator/payload';
import { AlbumSchema } from '@/types/AlbumTypes';
import AlbumsHandler from '@/api/albums/handler';
import routesAlbum from '@/api/albums/routes';

const AlbumPlugin = {
	name: 'app/album',
	version: '1.0.0',
	dependencies: ['prisma'],
	register: async (server: Hapi.Server) => {
		const notesHandler = new AlbumsHandler(AlbumSchema, PayloadValidator);
		server.route(routesAlbum(notesHandler));
	},
};

export default AlbumPlugin;
