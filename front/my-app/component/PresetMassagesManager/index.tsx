"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Smile, ImageIcon, Trash } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import toast from "react-hot-toast";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";
import type { PresetMessage } from "@/types";

interface PresetMessagesManagerProps {
  presetMessages: PresetMessage[];
  setPresetMessages: React.Dispatch<React.SetStateAction<PresetMessage[]>>;
}

export default function PresetMessagesManager({ presetMessages, setPresetMessages }: PresetMessagesManagerProps) {
  const [newPresetMessage, setNewPresetMessage] = useState<PresetMessage>({ case: "", text: "", image: "" });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const addPresetMessage = async () => {
    if (!newPresetMessage.case.trim() || !newPresetMessage.text.trim()) {
      toast.error("Por favor, completa todos los campos antes de agregar.");
      return;
    }
    toast.promise(
      fetch("http://localhost:3001/mensaje", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPresetMessage),
      })
        .then(async (res) => {
          if (!res.ok) throw new Error("Error al guardar el mensaje");
          return res.json();
        })
        .then((data) => {
          setPresetMessages([...presetMessages, data]);
          setNewPresetMessage({ case: "", text: "", image: ""  });
        }),
      {
        loading: "Guardando mensaje...",
        success: "Mensaje creado exitosamente!",
        error: "Hubo un error al crear el mensaje.",
      }
    );
  };

  const confirmAndAddPresetMessage = () => {
    setShowConfirmDialog(true);
  };

  return (
    <Card className="mb-6 shadow-lg">
      <CardHeader>
        <CardTitle>Mensajes Pre-armados</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <Input
              placeholder="Título del mensaje"
              value={newPresetMessage.case}
              onChange={(e) => setNewPresetMessage({ ...newPresetMessage, case: e.target.value })}
            />
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
                <EmojiPicker onEmojiClick={(emojiObject) => setNewPresetMessage({ ...newPresetMessage, text: newPresetMessage.text + emojiObject.emoji })} />
              </div>
            )}
            <div className="flex space-x-2">
              <Button onClick={confirmAndAddPresetMessage} className="bg-green-600 hover:bg-green-700 transition-colors duration-200 shadow-md">
                <Plus className="mr-2 h-4 w-4" /> Agregar
              </Button>
            </div>
          </div>
        </div>
      </CardContent>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>Este mensaje será guardado y no podrá ser editado después.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel  onClick={() => setShowConfirmDialog(false) }>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-green-500 hover:bg-green-600 transition-colors duration-200 shadow-md " onClick={() => { addPresetMessage(); setShowConfirmDialog(false); }}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}