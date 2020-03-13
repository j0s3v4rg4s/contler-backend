export interface UserTokes {
  [uid: string]: Token[];
}

interface Token {
  [id: string]: boolean;
}
