import Hapi from '@hapi/hapi';
import PayloadValidator from '@/validator/payload';
import { SongSchema } from '@/types/SongTypes';
import SongsHandler from '@/api/songs/handler';
import routesSong from '@/api/songs/routes';

const SongPlugin = {
	name: 'app/song',
	version: '1.0.0',
	dependencies: ['prisma'],
	register: async (server: Hapi.Server) => {
		const notesHandler = new SongsHandler(SongSchema, PayloadValidator);
		server.route(routesSong(notesHandler));
	},
};

export default SongPlugin;
