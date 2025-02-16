export interface contact {
  id: string;
  name: string;
  phone: string;
}

export interface allContact{
    contacts: contact[];
}

export interface mesagge {
    id: string;
    name: string;
    text: string;
    img: string;
}
export interface allMesagge {
    messages: mesagge[];
}
