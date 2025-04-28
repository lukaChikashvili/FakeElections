"use client"
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Loader2, MoreHorizontal, Plus, Search, Trash2, Wine } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import useFetch from '../../../../../../hooks/useFetch';
import { deleteParty, getParties } from '../../../../../../actions/parties';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';



const PartyList = () => {
    const router = useRouter();

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [partyToDelete, setPartyToDelete] = useState(null);

    const {
         loading: PartyLoading,
         fn: fetchParty,
         data: partyResult,
         error: partyError
    } = useFetch(getParties);

    const {
      loading: deleteLoading,
      fn: deletePartyfn,
      data: deleteResult,
      error: deleteError
 } = useFetch(deleteParty);

    useEffect(() => {
        fetchParty();
      }, []);
      

      
      useEffect(() => {
        if (deleteResult?.success) {
          toast.success("პარტია წაიშალა წარმატებით");
          fetchParty();
        }
    
       
      }, [deleteResult]);


      const handlePartyDelete = async () => {
        if(!partyToDelete) return;

        await deletePartyfn(partyToDelete.id);

        setDeleteDialogOpen(false);
        setPartyToDelete(null);

      }

  return (
    <div>
       <div className="w-full mt-12">
      <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
        <Button
          variant="outline"
          onClick={() => router.push("/admin/parties/create")}
          className="flex items-center cursor-pointer bg-blue-500 text-white"
        >
          <Plus className="h-4 w-4" />
          დაამატე პარტია
        </Button>

     
      </div>

      <Card className="mt-4">
        <CardContent className="p-0">
          {PartyLoading && !partyResult ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : partyResult?.success && partyResult?.data.length > 0 ? (
            <div className="overflow-x-auto ">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>პარტიის სახელი</TableHead>
                    <TableHead>დაფუძნების წელი</TableHead>
                    <TableHead>საარჩევნო ნომერი</TableHead>
                    <TableHead>პარტიის თავმჯდომარე</TableHead>
                    <TableHead className="text-right">მოქმედება</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody >
                  {partyResult?.data.map((party) => (
                    <TableRow key={party.id}>
                      <TableCell>
                        <div className="w-10 h-10 rounded-md overflow-hidden ">
                        {party.imageUrl ? (
                              <Image
                                src={party.imageUrl}
                                alt={party.name}
                                height={40}
                                width={40}
                                className="w-full h-full object-cover"
                                priority
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <Wine className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {party.name} 
                      </TableCell>

                      <TableCell className="font-medium">
                        {party.foundedYear} 
                      </TableCell>

                      <TableCell className="font-medium">
                        {party.partyNumber} 
                      </TableCell>

                      <TableCell className="font-medium">
                        {party.partyLeader} 
                      </TableCell>
                      
                      
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-0 h-9 w-9"
                         
                          
                        >
                       
                        </Button>
                      </TableCell>

                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-0 h-8 w-8"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>მოქმედება</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => router.push(`/parties/${party.id}`)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              ნახვა
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                           
                           
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => {
                                setPartyToDelete(party);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              წაშლა
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>


                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
             პარტიები არ არის
            </div>
          )}
        </CardContent>
      </Card>


      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>დაადასტურე წაშლა</DialogTitle>
            <DialogDescription>
              ნამდვილად გინდა წაშალო {" "}
              ? ამ მოქმედებას უკან ვერ დააბრუნებ.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            
            >
              გაუქმება
            </Button>
            <Button
              variant="destructive"
              onClick={handlePartyDelete}
              
            >
              {deleteLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  იშლება...
                </>
              ) : (
                "წაშალე პარტია"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </div>
  )
}

export default PartyList
