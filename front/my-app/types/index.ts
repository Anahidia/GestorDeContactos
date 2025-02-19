

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
  selected?: boolean
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
  
  export interface ContactsResponse {
    contacts: Contact[]
    total: number
    totalPages: number
    prevPage: number | null
    nextPage: number | null
  }
  