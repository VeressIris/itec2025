// pages/profile.tsx
import React, { useEffect, useState } from "react";
import { useClerk } from "@clerk/nextjs";
import { backendUrl, urlToFile } from "@/utils";
import ProfileSkeleton from "./profile-content";
import ProfileContent from "./profile-skeleton";
import { SelectChangeEvent } from "@mui/material";

interface ProfileFormValues {
  name: string;
  profileImage?: File;
  age: number;
  gender: string;
  githubLink: string;
  country: string;
  city: string;
  languages: string[];
  technologies: string[];
  description: string;
  codingTimePreference: string[];
}

const defaultState: ProfileFormValues = {
  name: "",
  age: 0,
  gender: "",
  githubLink: "",
  country: "",
  city: "",
  languages: [],
  technologies: [],
  description: "",
  codingTimePreference: [],
};

export default function ProfilePage(): React.ReactElement {
  const { user } = useClerk();

  const [edit, setEdit] = useState(false);
  const [formValues, setFormValues] = useState<ProfileFormValues>({ ...defaultState });
  const [formPrevValues, setFormPrevValues] = useState<ProfileFormValues>({ ...defaultState });
  const [loading, setLoading] = useState(true);

  const getCurrentUser = async () => {
    const params = new URLSearchParams({ userId: user?.id || "" });
    const response = await fetch(`${backendUrl}/getUser?${params.toString()}`);
    const data = await response.json();
    return data;
  };

  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      try {
        const userData = await getCurrentUser();
        const values: ProfileFormValues = {
          name: userData.name || "",
          profileImage: userData.profileImage
            ? await urlToFile(user?.imageUrl || userData.profileImage)
            : undefined,
          age: userData.age || 0,
          gender: userData.gender || "",
          githubLink: userData.githubLink || "",
          country: userData.country || "",
          city: userData.city || "",
          languages: userData.languages || [],
          technologies: userData.technologies || [],
          description: userData.description || "",
          codingTimePreference: userData.codingTimePreference || [],
        };
        setFormValues(values);
        setFormPrevValues({ ...values });
      } catch (error) {
        console.error(error);
        setFormValues({ ...defaultState });
        setEdit(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = event.target;
    if (type === "file" && files && files.length > 0) {
      setFormValues((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormValues((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleGenderChange = (event: SelectChangeEvent) => {
    setFormValues((prev) => ({ ...prev, gender: event.target.value }));
  };

  const handleEdit = () => {
    setFormPrevValues({ ...formValues });
    setEdit(true);
  };

  const handleReset = () => {
    setFormValues(formPrevValues);
    setEdit(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!edit) return;

    const formData = new FormData();
    Object.entries(formValues).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        formData.append(key, value.join(","));
      } else {
        formData.append(key, value as string | Blob);
      }
    });

    // TODO: send formData to backend
    setEdit(false);
  };

  return loading ? (
    <ProfileSkeleton />
  ) : (
    <ProfileContent
      formValues={formValues}
      edit={edit}
      handleChange={handleChange}
      handleGenderChange={handleGenderChange}
      handleEdit={handleEdit}
      handleSubmit={handleSubmit}
      handleReset={handleReset}
    />
  );
}
