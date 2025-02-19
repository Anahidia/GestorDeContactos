"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PhoneIcon as WhatsappIcon } from "lucide-react"
import PresetMessagesManager from "@/component/PresetMassagesManager"
import ContactList from "@/component/ContactList"
import ContactsManager from "@/component/ContactsManager"
import type { PresetMessage, MessageCounts, MessageLimits, Contact } from "@/types"

const DEFAULT_LIMITS: MessageLimits = {
  daily: 100,
  monthly: 1000,
}

export default function Home() {
  const [presetMessages, setPresetMessages] = useState<PresetMessage[]>([])
  const [messageCounts, setMessageCounts] = useState<MessageCounts>({ daily: 0, monthly: 0 })
  const [messageLimits] = useState<MessageLimits>(DEFAULT_LIMITS)
  const [contacts, setContacts] = useState<Contact[]>([])

  useEffect(() => {
    const storedCounts = localStorage.getItem("messageCounts")
    const storedPresetMessages = localStorage.getItem("presetMessages")
    const storedContacts = localStorage.getItem("contacts")
    if (storedCounts) setMessageCounts(JSON.parse(storedCounts))
    if (storedPresetMessages) setPresetMessages(JSON.parse(storedPresetMessages))
    if (storedContacts) setContacts(JSON.parse(storedContacts))
  }, [])

  useEffect(() => {
    localStorage.setItem("messageCounts", JSON.stringify(messageCounts))
    localStorage.setItem("presetMessages", JSON.stringify(presetMessages))
    localStorage.setItem("contacts", JSON.stringify(contacts))
  }, [messageCounts, presetMessages, contacts])

  return (
    <div className="container mx-auto p-4 bg-gradient-to-b from-green-50 to-white min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-green-600 flex items-center justify-center bg-white p-4 rounded-lg shadow-lg">
        <WhatsappIcon className="mr-4 h-8 w-8" /> Gestor de Contactos WhatsApp
      </h1>

      <Tabs defaultValue="contacts" className="mb-6">
        <TabsList className="grid w-full grid-cols-3 mb-4 bg-green-100 p-1 rounded-lg">
          <TabsTrigger value="contacts" className="data-[state=active]:bg-white data-[state=active]:text-green-600">
            Contactos
          </TabsTrigger>
          <TabsTrigger value="messages" className="data-[state=active]:bg-white data-[state=active]:text-green-600">
            Mensajes Pre-armados
          </TabsTrigger>
          <TabsTrigger
            value="manage-contacts"
            className="data-[state=active]:bg-white data-[state=active]:text-green-600"
          >
            Gestionar Contactos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contacts">
          <ContactList
            presetMessages={presetMessages}
            messageCounts={messageCounts}
            setMessageCounts={setMessageCounts}
            messageLimits={messageLimits}
          />
        </TabsContent>
        <TabsContent value="messages">
          <PresetMessagesManager presetMessages={presetMessages} setPresetMessages={setPresetMessages} />
        </TabsContent>
        <TabsContent value="manage-contacts">
          <ContactsManager contacts={contacts} setContacts={setContacts} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

