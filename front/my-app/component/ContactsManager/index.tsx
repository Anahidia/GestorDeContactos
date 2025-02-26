"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import type { Contact } from "@/types"

interface ContactsManagerProps {
  setContacts: React.Dispatch<React.SetStateAction<Contact[]>>
}

export default function ContactsManager({ setContacts }: ContactsManagerProps) {
  const [newContact, setNewContact] = useState({ name: "", number: "" })
  const [isLoading, setIsLoading] = useState(false)

  const addContact = async () => {
    if (newContact.name && newContact.number) {
      const contactToSend = {
        ...newContact,
        
      }

      setIsLoading(true)
      try {
        // Enviar el nuevo contacto al servidor
        const response = await fetch("http://localhost:3001/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(contactToSend),
        })

        if (!response.ok) {
          throw new Error("Error al enviar el contacto")
        }

        // Respuesta exitosa
        const addedContact = await response.json()

        // Actualiza el estado global de contactos desde el backend
        setContacts((prevContacts) => [...prevContacts, addedContact])

        setNewContact({ name: "", number: "" })
        alert("Contacto agregado exitosamente")
      } catch (error) {
        console.error("Error:", error)
        alert("Error al agregar el contacto")
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <Card className="mb-6 shadow-lg">
      <CardHeader>
        <CardTitle>Gestión de Contactos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-3 gap-2">
            <Input
              placeholder="Nombre"
              value={newContact.name}
              onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
            />
            <Input
              placeholder="Teléfono"
              value={newContact.number}
              onChange={(e) => setNewContact({ ...newContact, number: e.target.value })}
            />
            <Button
              onClick={addContact}
              className="bg-green-600 hover:bg-green-700 transition-colors duration-200 shadow-md"
              disabled={isLoading}
            >
              <Plus className="mr-2 h-4 w-4" /> Agregar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
