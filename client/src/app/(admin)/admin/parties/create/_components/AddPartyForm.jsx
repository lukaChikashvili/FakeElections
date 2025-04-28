"use client";

import React, { useCallback, useEffect, useState } from "react";
import { AddPartyToDB } from "../../../../../../../actions/parties";
import { useDropzone } from "react-dropzone/";
import useFetch from "../../../../../../../hooks/useFetch";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Trash2, Upload, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
 

const AddPartyForm = () => {
  const [partyName, setPartyName] = useState("");
  const [partyNumber, setPartyNumber] = useState(0);
  const [partyLeader, setPartyLeader] = useState("");
  const [foundedYear, setFoundedYear] = useState("");
  const [description, setDescription] = useState("");
  const [members, setMembers] = useState([{ name: "", imageUrl: "" }]);  
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageError, setImageError] = useState("");
  const router = useRouter();

 
  const handleAddMember = () => {
    setMembers([...members, { name: "", imageUrl: "" }]);  
  };

  
  const handleRemoveMember = (index) => {
    const updatedMembers = [...members];
    updatedMembers.splice(index, 1);  
    setMembers(updatedMembers);
  };

  const handleMemberChange = (index, e) => {
    const updatedMembers = [...members];
    updatedMembers[index][e.target.name] = e.target.value;  
    setMembers(updatedMembers);
  };

  const onMultiImagesDrop = useCallback((acceptedFiles) => {
    const validFiles = acceptedFiles.filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 5MB limit and will be skipped`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);

        const newImages = [];
        validFiles.forEach((file) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            newImages.push(e.target.result);

            if (newImages.length === validFiles.length) {
              setUploadedImages((prev) => [...prev, ...newImages]);
              setUploadProgress(0);
              setImageError("");
              toast.success(
                `Successfully uploaded ${validFiles.length} images`
              );
            }
          };
          reader.readAsDataURL(file);
        });
      }
    }, 200);
  }, []);

  const {
    getRootProps: getMultiImageRootProps,
    getInputProps: getMultiImageInputProps,
  } = useDropzone({
    onDrop: onMultiImagesDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    multiple: true,
  });

  const {
    loading: addPartyLoading,
    fn: addPartyfn,
    data: addPartyResult,
  } = useFetch(AddPartyToDB);

  useEffect(() => {
    if (addPartyResult?.success) {
      toast.success("პარტია აიტვირთა წარმატებით");
      router.push("/admin/parties");
    }
  }, [addPartyResult, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!partyName) {
      toast.error("Please provide a party name");
      return;
    }

    if (members.some((member) => !member.name || !member.imageUrl)) {
      toast.error("Please fill all member details");
      return;
    }

    if (!uploadedImages || uploadedImages.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    await addPartyfn({
      partyData: {
        name: partyName,
        partyLeader: partyLeader,
        partyNumber: partyNumber,
        foundedYear: foundedYear,
        description: description,
        members: members,  
      },
      images: uploadedImages,
    });
  };

  const removeImage = (index) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };


  return (
    <Card>
    <form onSubmit={handleSubmit} className="space-y-4 px-12">
      <div>
        <label className="block text-sm font-medium text-gray-700">პარტიის სახელი</label>
        <input
          type="text"
          value={partyName}
          onChange={(e) => setPartyName(e.target.value)}
          className="mt-2 p-2 border border-gray-300 rounded w-full"
          placeholder="ჩაწერეთ პარტიის სახელი..."
        />

        
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">პარტიის ნომერი</label>
        <input
          type="number"
          value={partyNumber}
          onChange={(e) => setPartyNumber(e.target.value ? parseInt(e.target.value) : "")}
          className="mt-2 p-2 border border-gray-300 rounded w-full"
          placeholder="ჩაწერეთ პარტიის ნომერი..."
        />

        
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">პარტიის დაფუძნების თარიღი</label>
        <input
          type="text"
          value={foundedYear}
          onChange={(e) => setFoundedYear(e.target.value)}
          className="mt-2 p-2 border border-gray-300 rounded w-full"
          placeholder="ჩაწერეთ პარტიის დაარსების თარიღი..."
        />

        
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">პარტიის თავმჯდომარე</label>
        <input
          type="text"
          value={partyLeader}
          onChange={(e) => setPartyLeader(e.target.value)}
          className="mt-2 p-2 border border-gray-300 rounded w-full"
          placeholder="ჩაწერეთ პარტიის თავმჯდომარე..."
        />

        
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">პარტიის აღწერა</label>
        <Textarea
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-2 p-2 border border-gray-300 rounded w-full"
          placeholder="ჩაწერეთ პარტიის აღწერა..."
        />

        
      </div>

      

      <div>
                  <Label
                    htmlFor="images"
                    className={imageError ? "text-red-500" : ""}
                  >
                    სურათები{" "}
                    {imageError && <span className="text-red-500">*</span>}
                  </Label>
                  <div className="mt-2">
                    <div
                      {...getMultiImageRootProps()}
                      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition ${
                        imageError ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <input {...getMultiImageInputProps()} />
                      <div className="flex flex-col items-center justify-center">
                        <Upload className="h-12 w-12 text-gray-400 mb-3" />
                        <span className="text-sm text-gray-600">
                          Drag & drop or click to upload multiple images
                        </span>
                        <span className="text-xs text-gray-500 mt-1">
                          (JPG, PNG, WebP, max 5MB each)
                        </span>
                      </div>
                    </div>
                    {imageError && (
                      <p className="text-xs text-red-500 mt-1">{imageError}</p>
                    )}
                    {uploadProgress > 0 && (
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    )}
                  </div>

                  {uploadedImages.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium mb-2">
                        ატვირთული სურათები ({uploadedImages.length})
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {uploadedImages.map((image, index) => (
                          <div key={index} className="relative group">
                            <Image
                              src={image}
                              alt={`Party image ${index + 1}`}
                              height={50}
                              width={50}
                              className="h-28 w-full object-cover rounded-md"
                              priority
                            />
                            <Button
                              type="button"
                              size="icon"
                              variant="destructive"
                              className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeImage(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                
                  </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">პარტიის წევრები</label>
        {members.map((member, index) => (
          <div key={index} className="flex items-center space-x-4 mt-2">
            <input
              type="text"
              name="name"
              value={member.name}
              onChange={(e) => handleMemberChange(index, e)}
              className="p-2 border border-gray-300 rounded w-1/2"
              placeholder="წევრის სახელი"
            />
            <input
              type="text"
              name="imageUrl"
              value={member.imageUrl}
              onChange={(e) => handleMemberChange(index, e)}
              className="p-2 border border-gray-300 rounded w-1/2"
              placeholder="წევრის სურათი"
            />
            <button
              type="button"
              onClick={() => handleRemoveMember(index)}
              className="text-red-500 hover:text-red-700"
            >
               <Trash2 />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddMember}
          className="mt-2 text-blue-500 hover:text-blue-700"
        >
          დაამატე წევრი
        </button>
      </div>

      <div className="mt-4">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {addPartyLoading ? "ემატება პარტია..." : "დაამატე პარტია"}
        </button>
      </div>
    </form>
    </Card>
  );
};

export default AddPartyForm;

