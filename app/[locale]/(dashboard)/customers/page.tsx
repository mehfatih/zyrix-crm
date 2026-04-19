"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Plus,
  Search,
  Mail,
  Phone,
  Building2,
  MoreHorizontal,
  Loader2,
} from "lucide-react";
import {
  listCustomers,
  type Customer,
} from "@/lib/api/customers";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { cn, getInitials, formatDate } from "@/lib/utils";
import { CreateCustomerModal } from "@/components/customers/CreateCustomerModal";

const STATUS_COLORS: Record<string, string> = {
  new: "bg-sky-100 text-sky-700",
  qualified: "bg-cyan-100 text-cyan-700",
  customer: "bg-success-light text-success-dark",
  lost: "bg-danger-light text-danger-dark",
};

export default function CustomersPage() {
  const params = useParams<{ locale: string }>();
  const locale = params?.locale || "en";

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [total, setTotal] = useState(0);
  const [showCreate, setShowCreate] = useState(false);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const result = await listCustomers({
        search: search || undefined,
        status: statusFilter || undefined,
        limit: 50,
      });
      setCustomers(result.customers);
      setTotal(result.pagination.total);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, statusFilter]);

  return (
    <DashboardShell locale={locale}>
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-ink">Customers</h1>
            <p className="text-sm text-ink-light mt-1">
              {total} {total === 1 ? "customer" : "customers"} total
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add customer
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or company…"
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 text-sm bg-white border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 min-w-[160px]"
          >
            <option value="">All statuses</option>
            <option value="new">New</option>
            <option value="qualified">Qualified</option>
            <option value="customer">Customer</option>
            <option value="lost">Lost</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-line-soft overflow-hidden">
          {loading ? (
            <div className="p-12 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
            </div>
          ) : customers.length === 0 ? (
            <div className="p-12 text-center">
              <Building2 className="w-12 h-12 text-ink-muted mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-ink mb-1">
                No customers yet
              </h3>
              <p className="text-sm text-ink-light mb-4">
                Start building your customer base by adding your first one.
              </p>
              <button
                onClick={() => setShowCreate(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700"
              >
                <Plus className="w-4 h-4" />
                Add customer
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-bg-subtle border-b border-line-soft">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-ink-light uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-ink-light uppercase tracking-wider hidden md:table-cell">
                      Company
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-ink-light uppercase tracking-wider hidden lg:table-cell">
                      Contact
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-ink-light uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-ink-light uppercase tracking-wider hidden sm:table-cell">
                      Deals
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-ink-light uppercase tracking-wider hidden md:table-cell">
                      Added
                    </th>
                    <th className="px-4 py-3 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line-soft">
                  {customers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="hover:bg-bg-subtle transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary-600 text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
                            {getInitials(customer.fullName)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-ink truncate">
                              {customer.fullName}
                            </p>
                            {customer.position && (
                              <p className="text-xs text-ink-muted truncate">
                                {customer.position}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <p className="text-sm text-ink">
                          {customer.companyName || "—"}
                        </p>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <div className="space-y-1">
                          {customer.email && (
                            <div className="flex items-center gap-1.5 text-xs text-ink-light">
                              <Mail className="w-3 h-3" />
                              <span className="truncate">{customer.email}</span>
                            </div>
                          )}
                          {customer.phone && (
                            <div className="flex items-center gap-1.5 text-xs text-ink-light">
                              <Phone className="w-3 h-3" />
                              <span>{customer.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "inline-flex px-2 py-0.5 text-[11px] font-medium rounded-full capitalize",
                            STATUS_COLORS[customer.status] ||
                              "bg-gray-100 text-gray-700"
                          )}
                        >
                          {customer.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-ink hidden sm:table-cell">
                        {customer._count?.deals ?? 0}
                      </td>
                      <td className="px-4 py-3 text-right text-xs text-ink-muted hidden md:table-cell">
                        {formatDate(customer.createdAt, locale)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button className="p-1.5 text-ink-muted hover:text-ink hover:bg-bg-base rounded">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showCreate && (
        <CreateCustomerModal
          onClose={() => setShowCreate(false)}
          onSuccess={() => {
            setShowCreate(false);
            fetchCustomers();
          }}
        />
      )}
    </DashboardShell>
  );
}