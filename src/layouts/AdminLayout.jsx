import React from "react"
import Sidebar from "../components/Sidebar"

export default function AdminLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 p-6 w-full">{children}</main>
    </div>
  )
}
