"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FileSpreadsheet, Plus, Upload } from "lucide-react"
import * as XLSX from "xlsx"
import type { Contact } from "@/types"

interface ContactsManagerProps {
  contacts: Contact[]
  setContacts: React.Dispatch<React.SetStateAction<Contact[]>>
}

export default function ContactsManager({ contacts, setContacts }: ContactsManagerProps) {
  const [newContact, setNewContact] = useState({ name: "", number: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [excelContacts, setExcelContacts] = useState<Contact[]>([])

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
          number: row.Telefono?.toString() || "",
          selected: false,
        }))
        setExcelContacts(newContacts)
        setIsLoading(false)
      }
      reader.readAsArrayBuffer(file)
    }
  }

  const sendExcelContacts = async () => {
    if (excelContacts.length === 0) {
      alert("No hay contactos para enviar")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("http://localhost:3002/contact/multiple", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(excelContacts),
      })

      if (!response.ok) {
        throw new Error("Error al enviar los contactos")
      }

      const newContacts = await response.json()
      setContacts((prevContacts) => [...prevContacts, ...newContacts])
      setExcelContacts([])
      alert("Contactos enviados exitosamente")
    } catch (error) {
      console.error("Error:", error)
      alert("Error al enviar los contactos")
    } finally {
      setIsLoading(false)
    }
  }

  const addContact = () => {
    if (newContact.name && newContact.number) {
      setContacts([...contacts, { ...newContact, id: Math.random().toString(36).substr(2, 9), selected: false }])
      setNewContact({ name: "", number: "" })
    }
  }

  return (
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
          {excelContacts.length > 0 && (
            <div>
              <Button
                onClick={sendExcelContacts}
                className="bg-blue-600 hover:bg-blue-700 transition-colors duration-200 shadow-md"
                disabled={isLoading}
              >
                <Upload className="mr-2 h-4 w-4" /> Enviar contactos de Excel
              </Button>
            </div>
          )}
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
            >
              <Plus className="mr-2 h-4 w-4" /> Agregar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

