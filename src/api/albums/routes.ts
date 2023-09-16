import Hapi from '@hapi/hapi';
import AlbumsHandler from "@/api/albums/handler";

const routesAlbum = (handler: AlbumsHandler) => [
	{
		method: 'POST',
		path: '/albums',
		handler: (request: Hapi.Request, h: Hapi.ResponseToolkit) => handler.postAlbumHandler(request, h),
	},
	{
		method: 'GET',
		path: '/albums',
		handler: (request: Hapi.Request) => handler.getAlbumsHandler(request),
	},
	{
		method: 'GET',
		path: '/albums/{id}',
		handler: (request: Hapi.Request) => handler.getAlbumByIdHandler(request),
	},
	{
		method: 'PUT',
		path: '/albums/{id}',
		handler: (request: Hapi.Request) => handler.putAlbumByIdHandler(request),
	},
	{
		method: 'DELETE',
		path: '/albums/{id}',
		handler: (request: Hapi.Request) => handler.deleteAlbumByIdHandler(request),
	},
];

export default routesAlbum;
