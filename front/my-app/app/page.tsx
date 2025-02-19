"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import * as XLSX from "xlsx"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
<<<<<<< HEAD
import { PhoneIcon as WhatsappIcon } from "lucide-react"
import PresetMessagesManager from "@/component/PresetMessagesManager"
import ContactList from "@/component/ContactList"
import ContactsManager from "@/component/ContactsManager"
import type { PresetMessage, MessageCounts, MessageLimits, Contact } from "@/types"
=======
import {
  PhoneIcon as WhatsappLogo,
  Plus,
  FileSpreadsheet,
  Send,
  Trash,
  ImageIcon,
  Smile,
  PhoneIcon as WhatsappIcon,
} from "lucide-react"
import EmojiPicker from "emoji-picker-react"

interface Contact {
  id: string
  name: string
  phone: string
  selected: boolean
}

interface MessageLimits {
  daily: number
  monthly: number
}

interface MessageCounts {
  daily: number
  monthly: number
}

interface PresetMessage {
  text: string
  image?: string
}
>>>>>>> 6d165f98ab5f16e93df0944b6cddbe7309c8c4b9

const DEFAULT_LIMITS: MessageLimits = {
  daily: 100,
  monthly: 1000,
}

export default function Home() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [filter, setFilter] = useState("")
  const [messageLimits] = useState<MessageLimits>(DEFAULT_LIMITS)
<<<<<<< HEAD
  const [contacts, setContacts] = useState<Contact[]>([])
=======
  const [messageCounts, setMessageCounts] = useState<MessageCounts>({ daily: 0, monthly: 0 })
  const [alertMessage, setAlertMessage] = useState<string | null>(null)
  const [presetMessages, setPresetMessages] = useState<PresetMessage[]>([])
  const [newPresetMessage, setNewPresetMessage] = useState<PresetMessage>({ text: "" })
  const [newContact, setNewContact] = useState({ name: "", phone: "" })
  const [selectedMessage, setSelectedMessage] = useState<PresetMessage>({ text: "" })
  const [showMessageDialog, setShowMessageDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const emojiPickerRef = useRef<HTMLDivElement>(null)
>>>>>>> 6d165f98ab5f16e93df0944b6cddbe7309c8c4b9

  useEffect(() => {
    const storedCounts = localStorage.getItem("messageCounts")
    const storedContacts = localStorage.getItem("contacts")
    const storedPresetMessages = localStorage.getItem("presetMessages")
    const storedContacts = localStorage.getItem("contacts")
    if (storedCounts) setMessageCounts(JSON.parse(storedCounts))
    if (storedContacts) setContacts(JSON.parse(storedContacts))
    if (storedPresetMessages) setPresetMessages(JSON.parse(storedPresetMessages))
    if (storedContacts) setContacts(JSON.parse(storedContacts))
  }, [])

  useEffect(() => {
    localStorage.setItem("messageCounts", JSON.stringify(messageCounts))
    localStorage.setItem("contacts", JSON.stringify(contacts))
    localStorage.setItem("presetMessages", JSON.stringify(presetMessages))
<<<<<<< HEAD
    localStorage.setItem("contacts", JSON.stringify(contacts))
  }, [messageCounts, presetMessages, contacts])
=======
  }, [messageCounts, contacts, presetMessages])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsLoading(true)
      const reader = new FileReader()
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: "array" })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const json = XLSX.utils.sheet_to_json(worksheet)
        const newContacts: Contact[] = json.map((row: any) => ({
          id: Math.random().toString(36).substr(2, 9),
          name: row.Nombre || "",
          phone: row.Telefono?.toString() || "",
          selected: false,
        }))
        setContacts((prevContacts) => [...prevContacts, ...newContacts])
        setIsLoading(false)
      }
      reader.readAsArrayBuffer(file)
    }
  }

  const toggleSelectAll = () => {
    setContacts(contacts.map((contact) => ({ ...contact, selected: !contact.selected })))
  }

  const toggleSelect = (id: string) => {
    setContacts(contacts.map((contact) => (contact.id === id ? { ...contact, selected: !contact.selected } : contact)))
  }

  const filteredContacts = contacts.filter(
    (contact) => contact.name.toLowerCase().includes(filter.toLowerCase()) || contact.phone.includes(filter),
  )

  const sendWhatsAppMessage = (phone: string, message: PresetMessage) => {
    if (messageCounts.daily >= messageLimits.daily) {
      setAlertMessage(`Has alcanzado el límite diario de ${messageLimits.daily} mensajes.`)
      return
    }
    if (messageCounts.monthly >= messageLimits.monthly) {
      setAlertMessage(`Has alcanzado el límite mensual de ${messageLimits.monthly} mensajes.`)
      return
    }

    const encodedMessage = encodeURIComponent(message.text)
    let url = `https://wa.me/${phone}?text=${encodedMessage}`
    if (message.image) {
      // Note: This is a simplified approach. In a real-world scenario, you'd need to host the image and share its URL.
      url += `&image=${encodeURIComponent(message.image)}`
    }
    window.open(url, "_blank")

    setMessageCounts((prev) => ({
      daily: prev.daily + 1,
      monthly: prev.monthly + 1,
    }))
  }

  const sendToSelected = () => {
    setShowMessageDialog(true)
  }

  const confirmSendToSelected = () => {
    setIsLoading(true)
    const selectedContacts = contacts.filter((contact) => contact.selected)
    selectedContacts.forEach((contact) => {
      sendWhatsAppMessage(contact.phone, selectedMessage)
    })
    setShowMessageDialog(false)
    setSelectedMessage({ text: "" })
    setIsLoading(false)
  }

  const addPresetMessage = () => {
    if (newPresetMessage.text.trim()) {
      setPresetMessages([...presetMessages, newPresetMessage])
      setNewPresetMessage({ text: "" })
    }
  }

  const addContact = () => {
    if (newContact.name && newContact.phone) {
      setContacts([...contacts, { ...newContact, id: Math.random().toString(36).substr(2, 9), selected: false }])
      setNewContact({ name: "", phone: "" })
    }
  }

  const removePresetMessage = (index: number) => {
    setPresetMessages(presetMessages.filter((_, i) => i !== index))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setNewPresetMessage({ ...newPresetMessage, image: e.target?.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const onEmojiClick = (emojiObject: any) => {
    setNewPresetMessage({ ...newPresetMessage, text: newPresetMessage.text + emojiObject.emoji })
    setShowEmojiPicker(false)
  }
>>>>>>> 6d165f98ab5f16e93df0944b6cddbe7309c8c4b9

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
          <Card className="mb-6 shadow-lg">
            <CardHeader>
              <CardTitle>Gestión de Contactos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="file-upload" className="block mb-2">
                    Cargar desde Excel
                  </Label>
                  <div className="flex items-center space-x-2">
                    <div className="relative flex-1">
                      <Input
                        id="file-upload"
                        type="file"
                        onChange={handleFileUpload}
                        accept=".xlsx, .xls"
                        className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                      />
                      <div className="bg-white border rounded px-4 py-2 flex items-center justify-between">
                        <span className="text-gray-500">Seleccionar archivo</span>
                        <FileSpreadsheet className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    {isLoading && <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-700"></div>}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Input
                    placeholder="Nombre"
                    value={newContact.name}
                    onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                  />
                  <Input
                    placeholder="Teléfono"
                    value={newContact.phone}
                    onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                  />
                  <Button
                    onClick={addContact}
                    className="bg-green-600 hover:bg-green-700 transition-colors duration-200 shadow-md"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Agregar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="messages">
          <Card className="mb-6 shadow-lg">
            <CardHeader>
              <CardTitle>Mensajes Pre-armados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <div className="flex-1 space-y-2">
                    <div className="flex space-x-2">
                      <Textarea
                        placeholder="Nuevo mensaje pre-armado"
                        value={newPresetMessage.text}
                        onChange={(e) => setNewPresetMessage({ ...newPresetMessage, text: e.target.value })}
                      />
                      <Button onClick={() => setShowEmojiPicker(!showEmojiPicker)} variant="outline">
                        <Smile className="h-4 w-4" />
                      </Button>
                    </div>
                    {showEmojiPicker && (
                      <div ref={emojiPickerRef} className="absolute z-10">
                        <EmojiPicker onEmojiClick={onEmojiClick} />
                      </div>
                    )}
                    <div className="flex space-x-2">
                      <div className="relative flex-1">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                        />
                        <div className="bg-white border rounded px-4 py-2 flex items-center justify-between">
                          <span className="text-gray-500">Seleccionar imagen</span>
                          <ImageIcon className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                      <Button
                        onClick={addPresetMessage}
                        className="bg-green-600 hover:bg-green-700 transition-colors duration-200 shadow-md"
                      >
                        <Plus className="mr-2 h-4 w-4" /> Agregar
                      </Button>
                    </div>
                  </div>
                  {newPresetMessage.image && (
                    <div className="w-24 h-24 relative">
                      <img
                        src={newPresetMessage.image || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                  )}
                </div>
                <ul className="space-y-2">
                  {presetMessages.map((message, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between p-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                    >
                      <div className="flex items-center space-x-3">
                        {message.image && (
                          <img
                            src={message.image || "/placeholder.svg"}
                            alt="Message image"
                            className="w-12 h-12 object-cover rounded-full border-2 border-green-200"
                          />
                        )}
                        <span className="text-gray-700">{message.text}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removePresetMessage(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-100"
                      >
                        <Trash className="h-5 w-5" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="manage-contacts">
          <ContactsManager contacts={contacts} setContacts={setContacts} />
        </TabsContent>
      </Tabs>

      <Card className="mb-6 shadow-lg">
        <CardHeader>
          <CardTitle>Lista de Contactos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Filtrar por nombre o teléfono"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>

          {alertMessage && (
            <Alert className="mb-4">
              <AlertTitle>Atención</AlertTitle>
              <AlertDescription>{alertMessage}</AlertDescription>
            </Alert>
          )}

          <div className="mb-4 text-sm text-gray-600">
            <p>
              Mensajes enviados hoy: {messageCounts.daily}/{messageLimits.daily}
            </p>
            <p>
              Mensajes enviados este mes: {messageCounts.monthly}/{messageLimits.monthly}
            </p>
          </div>

          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="bg-green-100">
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={contacts.length > 0 && contacts.every((c) => c.selected)}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Teléfono</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContacts.map((contact) => (
                  <TableRow key={contact.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <TableCell>
                      <Checkbox checked={contact.selected} onCheckedChange={() => toggleSelect(contact.id)} />
                    </TableCell>
                    <TableCell>{contact.name}</TableCell>
                    <TableCell>{contact.phone}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4">
            <Button
              onClick={sendToSelected}
              className="bg-green-600 hover:bg-green-700 transition-colors duration-200 shadow-md"
            >
              <Send className="mr-2 h-4 w-4" /> Enviar a seleccionados
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Seleccionar o crear mensaje</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Label>Seleccionar mensaje pre-armado:</Label>
            <select
              className="w-full p-2 border rounded"
              onChange={(e) => setSelectedMessage(presetMessages[Number.parseInt(e.target.value)])}
              value={presetMessages.findIndex((m) => m.text === selectedMessage.text)}
            >
              <option value={-1}>Seleccionar mensaje...</option>
              {presetMessages.map((message, index) => (
                <option key={index} value={index}>
                  {message.text}
                </option>
              ))}
            </select>
            <Label>O crear un nuevo mensaje:</Label>
            <Textarea
              value={selectedMessage.text}
              onChange={(e) => setSelectedMessage({ ...selectedMessage, text: e.target.value })}
              placeholder="Escribe tu mensaje aquí..."
            />
            {selectedMessage.image && (
              <div className="w-24 h-24 relative">
                <img
                  src={selectedMessage.image || "/placeholder.svg"}
                  alt="Selected message image"
                  className="w-full h-full object-cover rounded"
                />
              </div>
            )}
            <Button
              onClick={confirmSendToSelected}
              className="w-full bg-green-600 hover:bg-green-700 transition-colors duration-200 shadow-md"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <WhatsappLogo className="mr-2 h-4 w-4" /> Enviar Mensaje
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}


