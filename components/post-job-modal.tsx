"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { Loader2 } from "lucide-react"

interface PostJobModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

export function PostJobModal({ isOpen, onClose, onSuccess }: PostJobModalProps) {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: "",
        location: "",
        salary: "",
        tags: "",
        description: "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!auth.currentUser) return

        setLoading(true)
        try {
            await addDoc(collection(db, "jobs"), {
                Title: formData.title,
                Location: formData.location,
                Salary: formData.salary,
                Description: formData.description,
                // Parse tags to array
                Accessibility: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
                CompanyName: "My Company", // Ideally fetch from profile
                employerId: auth.currentUser.uid,
                createdAt: serverTimestamp(),
                // Default flags for now
                isRemote: formData.location.toLowerCase().includes("remote"),
                screenReader: true,
                flexibleHours: true,
                neurodiverse: true,
            })
            onSuccess()
            onClose()
            // Reset form
            setFormData({ title: "", location: "", salary: "", tags: "", description: "" })
        } catch (error) {
            console.error("Error posting job:", error)
            alert("Failed to post job")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Create a Job Posting</DialogTitle>
                    <DialogDescription>
                        Fill in the details below to find your next great hire.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-base font-semibold">Job Title</Label>
                        <Input
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. Senior Product Designer"
                            required
                            className="text-lg py-5"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="location" className="font-semibold">Location</Label>
                            <Input
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="e.g. Remote / New York"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="salary" className="font-semibold">Salary Range (Optional)</Label>
                            <Input
                                id="salary"
                                name="salary"
                                value={formData.salary}
                                onChange={handleChange}
                                placeholder="e.g. $100k - $120k"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tags" className="font-semibold">Tags (Comma separated)</Label>
                        <Input
                            id="tags"
                            name="tags"
                            value={formData.tags}
                            onChange={handleChange}
                            placeholder="React, Accessibility, Remote"
                        />
                        <p className="text-xs text-gray-500">
                            Add specific skills or keywords to help candidates find this job.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description" className="font-semibold">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Detailed job description..."
                            className="min-h-[150px]"
                            required
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Publish Job
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
