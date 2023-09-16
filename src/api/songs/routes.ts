import Hapi from '@hapi/hapi';
import SongHandler from '@/api/songs/handler';

const routesSong = (handler: SongHandler) => [
	{
		method: 'POST',
		path: '/songs',
		handler: (request: Hapi.Request, h: Hapi.ResponseToolkit) => handler.postSongHandler(request, h),
	},
	{
		method: 'GET',
		path: '/songs',
		handler: (request: Hapi.Request) => handler.getSongsHandler(request),
	},
	{
		method: 'GET',
		path: '/songs/{id}',
		handler: (request: Hapi.Request) => handler.getSongByIdHandler(request),
	},
	{
		method: 'PUT',
		path: '/songs/{id}',
		handler: (request: Hapi.Request) => handler.putSongByIdHandler(request),
	},
	{
		method: 'DELETE',
		path: '/songs/{id}',
		handler: (request: Hapi.Request) => handler.deleteSongByIdHandler(request),
	},
];

export default routesSong;
