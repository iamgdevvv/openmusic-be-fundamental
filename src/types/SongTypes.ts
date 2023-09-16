import { z } from 'zod';

const SongSchema = z.object({
	id: z
		.string({
			invalid_type_error: 'ID lagu wajib dalam format string',
		})
		.optional(),
	title: z.string({
		required_error: 'Mohon isi judul lagu',
		invalid_type_error: 'Judul lagu wajib dalam format string',
	}),
	year: z
		.number({
			required_error: 'Mohon isi tahun lagu',
			invalid_type_error: 'Tahun lagu wajib dalam format number',
		})
		.min(0, 'Tahun lagu tidak bisa kurang dari waktu 0')
		.max(new Date().getFullYear(), 'Tahun lagu tidak bisa melebihi waktu saat ini'),
	performer: z.string({
		required_error: 'Mohon isi penampil',
		invalid_type_error: 'Penampil wajib dalam format string',
	}),
	genre: z.string({
		required_error: 'Mohon isi genre lagu',
		invalid_type_error: 'Genre lagu wajib dalam format string',
	}),
	duration: z
		.number({
			invalid_type_error: 'Durasi lagu wajib dalam format number',
		})
		.min(0, 'Durasi	 lagu tidak bisa kurang dari waktu 0')
		.optional(),
	albumId: z
		.string({
			invalid_type_error: 'album id wajib dalam format string',
		})
		.optional(),
});

// extract the inferred type
type ISong = z.infer<typeof SongSchema>;

export { SongSchema, ISong };
