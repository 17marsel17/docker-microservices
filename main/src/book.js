import { v4 as uuid} from 'uuid';

export class Book {
    constructor(title = 'title', desc = 'description', authors = 'authors', favorite = 'favorite', fileCover = 'fileCover', fileName = 'fileName', fileBook = 'fileBook', id = uuid()) {
        this.title = title;
        this.desc = desc;
        this.authors = authors;
        this.favorite = favorite;
        this.fileCover = fileCover;
        this.fileName = fileName;
        this.fileBook = fileBook;
        this.id = id;
    }
}

export const store = {
    books: []
}