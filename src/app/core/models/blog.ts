// import { AuthenticationService } from '../services';

export interface Blog {
  title: string;
  content: string;
  author: string;
  order: number;
  enable?: boolean;
  ontop?: boolean;
  createDate: Date;
  modifiedDate: Date;
  imgurl?: string;
  imgTitle?: string;
  img?: any;
  id?: string;
}

// export class Blog {
//   constructor(
//       public title: string,
//       public content: string,
//       public imgTitle?: string,
//       public img?: any,
//       public id?: string
//   ){}

// }
