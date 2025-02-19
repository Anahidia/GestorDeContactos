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
export interface Contact {
    id: string
    name: string
    number: string
    created_at: string
    selected?: boolean
  }
  
  export interface ContactsResponse {
    contacts: Contact[]
    total: number
    totalPages: number
    prevPage: number | null
    nextPage: number | null
  }
  
  export interface PresetMessage {
    text: string
    image?: string
  }
  
  export interface MessageCounts {
    daily: number
    monthly: number
  }
  
  export interface MessageLimits {
    daily: number
    monthly: number
  }
  
  