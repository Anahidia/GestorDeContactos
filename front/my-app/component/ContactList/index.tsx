"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Send,
  PhoneIcon as WhatsappIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type {
  Contact,
  PresetMessage,
  MessageCounts,
  MessageLimits,
  ContactsResponse,
} from "@/types";

interface ContactListProps {
  presetMessages: PresetMessage[]; // Array de mensajes predefinidos
  messageCounts: MessageCounts;
  setMessageCounts: React.Dispatch<React.SetStateAction<MessageCounts>>;
  messageLimits: MessageLimits;
}

export default function ContactList({
  presetMessages,
  messageCounts,
  setMessageCounts,
  messageLimits,
}: ContactListProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filter, setFilter] = useState("");
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  // Modifica la definición del estado para los mensajes predefinidos
  const [selectedMessage, setSelectedMessage] = useState<PresetMessage>({
    text: "",
    case: "",
    id: "",
  });
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedCount, setSelectedCount] = useState(0);
  const [presetMessagesState, setPresetMessagesState] = useState<
    PresetMessage[]
  >([]);

  useEffect(() => {
    fetchContacts(currentPage);
  }, [currentPage]);

  // Obtener los mensajes desde el backend
  useEffect(() => {
    fetchPresetMessages(); // Llamamos a la API cuando el componente se monta
  }, []);

  // Actualiza la función fetchPresetMessages
  const fetchPresetMessages = async () => {
    try {
      const response = await fetch("http://localhost:3001/mensaje");
      const data = await response.json();
      console.log("Mensajes cargados:", data); // Para depuración
      setPresetMessagesState(data); // Almacena los mensajes en el estado
    } catch (error) {
      console.error("Error al obtener los mensajes:", error);
      setAlertMessage("Error al cargar los mensajes predefinidos.");
    }
  };

  // Asegúrate de que esta función se llame en el useEffect
  useEffect(() => {
    fetchPresetMessages();
  }, []);

  useEffect(() => {
    fetchPresetMessages(); // Llamamos a la API cuando el componente se monta
  }, []);

  const fetchContacts = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3001/contact?page=${page}`
      );
      const data: ContactsResponse = await response.json();
      setContacts(
        data.contacts.map((contact) => ({ ...contact, selected: false }))
      );
      setTotalPages(data.totalPages);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      setAlertMessage(
        "Error al cargar los contactos. Por favor, intente de nuevo."
      );
      setIsLoading(false);
    }
  };

  const toggleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setContacts(
      contacts.map((contact) => ({ ...contact, selected: newSelectAll }))
    );
    setSelectedCount(newSelectAll ? contacts.length : 0);
  };

  const toggleSelect = (id: string) => {
    setContacts(
      contacts.map((contact) =>
        contact.id === id
          ? { ...contact, selected: !contact.selected }
          : contact
      )
    );
    setSelectedCount((prev) =>
      contacts.find((c) => c.id === id)?.selected ? prev - 1 : prev + 1
    );
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(filter.toLowerCase()) ||
      contact.number.includes(filter)
  );

  const sendWhatsAppMessage = (phone: string, message: PresetMessage) => {
    if (messageCounts.daily >= messageLimits.daily) {
      setAlertMessage(
        `Has alcanzado el límite diario de ${messageLimits.daily} mensajes.`
      );
      return;
    }
    if (messageCounts.monthly >= messageLimits.monthly) {
      setAlertMessage(
        `Has alcanzado el límite mensual de ${messageLimits.monthly} mensajes.`
      );
      return;
    }

    const encodedMessage = encodeURIComponent(message.text);
    let url = `https://wa.me/${phone}?text=${encodedMessage}`;
    if (message.image) {
      url += `&image=${encodeURIComponent(message.image)}`;
    }
    window.open(url, "_blank");

    setMessageCounts((prev) => ({
      daily: prev.daily + 1,
      monthly: prev.monthly + 1,
    }));
  };

  const sendToSelected = () => {
    setShowMessageDialog(true);
  };

  const confirmSendToSelected = () => {
    setIsLoading(true);
    const selectedContacts = contacts.filter((contact) => contact.selected);
    selectedContacts.forEach((contact) => {
      sendWhatsAppMessage(contact.number, selectedMessage);
    });
    setShowMessageDialog(false);
    setSelectedMessage({ text: "", case: "", id: "" });
    setIsLoading(false);
  };

  return (
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
            Mensajes enviados este mes: {messageCounts.monthly}/
            {messageLimits.monthly}
          </p>
          <p>Contactos seleccionados: {selectedCount}</p>
        </div>

        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="bg-green-100">
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectAll}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Fecha de creación</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContacts.map((contact) => (
                <TableRow
                  key={contact.id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <TableCell>
                    <Checkbox
                      checked={contact.selected}
                      onCheckedChange={() => toggleSelect(contact.id)}
                    />
                  </TableCell>
                  <TableCell>{contact.name}</TableCell>
                  <TableCell>{contact.number}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            variant="outline"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Anterior
          </Button>
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <Button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            variant="outline"
          >
            Siguiente <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="mt-4">
          <Button
            onClick={sendToSelected}
            className="bg-green-600 hover:bg-green-700 transition-colors duration-200 shadow-md"
            disabled={selectedCount === 0}
          >
            <Send className="mr-2 h-4 w-4" /> Enviar a seleccionados (
            {selectedCount})
          </Button>
        </div>

        {/* Modifica el contenido del Dialog para usar presetMessages */}
        <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
          <DialogContent className="sm:max-w-[425px] bg-white rounded-lg shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-900">
                Seleccionar mensaje
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4 space-y-6">
              <div>
                <Label
                  htmlFor="message-select"
                  className="block text-sm font-sans text-gray-700 mb-2"
                >
                  Seleccionar mensaje pre-armado:
                </Label>
                <select
                  id="message-select"
                  className="w-full p-2 border block text-sm font-sans text-gray-700 mb-2 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    const selected = presetMessagesState.find(
                      (message) => message.id === selectedId
                    );
                    if (selected) {
                      setSelectedMessage(selected);
                    } else {
                      setSelectedMessage({ text: "", case: "", id: "" });
                    }
                  }}
                  value={selectedMessage.id || ""}
                >
                  <option value="">Seleccionar mensaje...</option>
                  {presetMessagesState.map((message) => (
                    <option key={message.id} value={message.id}>
                      {message.case}
                    </option>
                  ))}
                </select>
              </div>

              {selectedMessage.case && (
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-700">
                    {selectedMessage.text}
                  </p>
                </div>
              )}

              <Button
                onClick={() => {
                  confirmSendToSelected();
                  console.log("Mensaje seleccionado:", selectedMessage.text);
                }}
                className="w-full bg-green-600 hover:bg-green-700 transition-colors duration-200 shadow-md text-white font-semibold py-2 px-4 rounded-md"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
                ) : (
                  <>
                    <WhatsappIcon className="mr-2 h-5 w-5 inline" /> Enviar
                    Mensaje
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
