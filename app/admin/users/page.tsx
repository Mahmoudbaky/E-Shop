import DeleteDialog from "@/components/shared/delete-dialog";
import Pagination from "@/components/shared/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllUsers, deleteUser } from "@/lib/actions/user.actions";
import { formatId } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Admin users",
};

const AdminUsersPage = async (params: {
  searchParams: Promise<{
    page: string;
    query?: string;
  }>;
}) => {
  const { page = "1", query: searchText } = await params.searchParams;
  const users = await getAllUsers({ page: Number(page), query: searchText });

  const session = await auth();

  if (session?.user?.role !== "admin") redirect("/admin/unauthorized");

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <h1 className="h2-bold">Users</h1>
        {searchText && (
          <div className="flex items-center gap-3">
            <p className="text-gray-500">Search results for: {searchText}</p>
            <Link href="/admin/users">
              <Button asChild variant="outline">
                <span className="text-gray-500">Clear search</span>
              </Button>
            </Link>
          </div>
        )}
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>NAME</TableHead>
              <TableHead>EMAIL</TableHead>
              <TableHead>ROLE</TableHead>
              <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.data.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{formatId(user.id)}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.role === "user" ? (
                    <Badge variant="secondary">User</Badge>
                  ) : (
                    <Badge variant="default">Admin</Badge>
                  )}
                </TableCell>

                <TableCell>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/users/${user.id}`}>Details</Link>
                  </Button>
                  <DeleteDialog id={user.id} action={deleteUser} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {users.pageCount > 1 && (
          <Pagination page={Number(page) || 1} totalPages={users?.pageCount} />
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;
