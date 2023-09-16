import { z } from 'zod';

const AlbumSchema = z.object({
	id: z
		.string({
			invalid_type_error: 'ID album wajib dalam format string',
		})
		.optional(),
	name: z.string({
		required_error: 'Mohon isi nama album',
		invalid_type_error: 'Nama album wajib dalam format string',
	}),
	year: z
		.number({
			required_error: 'Mohon isi tahun album',
			invalid_type_error: 'Tahun album wajib dalam format number',
		})
		.min(0, 'Tahun album tidak bisa kurang dari waktu 0')
		.max(new Date().getFullYear(), 'Tahun album tidak bisa melebihi waktu saat ini'),
});

// extract the inferred type
type IAlbum = z.infer<typeof AlbumSchema>;

export { AlbumSchema, IAlbum };
