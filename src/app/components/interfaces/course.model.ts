export interface Course {
    id: number;          // Un identificador único para el curso
    title: string;       // El título del curso
    description: string; // Una breve descripción del curso
    type: 'document' | 'video'; // El tipo de curso, puede ser un documento o un vídeo
    url: string;         // La URL del documento o el ID del vídeo de YouTube
}