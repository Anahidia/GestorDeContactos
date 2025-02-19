"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Smile, ImageIcon, Trash } from "lucide-react"
import EmojiPicker from "emoji-picker-react"
import type { PresetMessage } from "@/types"

interface PresetMessagesManagerProps {
  presetMessages: PresetMessage[]
  setPresetMessages: React.Dispatch<React.SetStateAction<PresetMessage[]>>
}

export default function PresetMessagesManager({ presetMessages, setPresetMessages }: PresetMessagesManagerProps) {
  const [newPresetMessage, setNewPresetMessage] = useState<PresetMessage>({ text: "" })
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const emojiPickerRef = useRef<HTMLDivElement>(null)

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

  const addPresetMessage = () => {
    if (newPresetMessage.text.trim()) {
      setPresetMessages([...presetMessages, newPresetMessage])
      setNewPresetMessage({ text: "" })
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

  return (
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
  )
}

