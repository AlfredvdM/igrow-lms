'use client';

/**
 * Lead List Page
 * Displays all leads with search, filtering, and pagination
 */

import { useState } from 'react';
import { SearchLg, ChevronLeft, ChevronRight } from '@untitledui/icons';
import { Trash2 } from 'lucide-react';
import { Input } from '@/components/base/input/input';
import { Select } from '@/components/base/select/select';
import { Button } from '@/components/base/buttons/button';
import { Badge } from '@/components/base/badges/badges';
import { Checkbox } from '@/components/base/checkbox/checkbox';
import { ConfirmationDialog } from '@/components/application/confirmation-dialog/confirmation-dialog';
import { CampaignSelector } from '@/components/application/campaign-selector/campaign-selector';
import { useCampaign } from '@/providers/campaign-provider';
import { useLeads, useDeleteLead, useDeleteLeads, type DateRangeFilter } from '@/hooks/use-supabase-leads';
import type { ApartmentPreference, PreferredContact, BestOutreachTime } from '@/types/database';

const ITEMS_PER_PAGE = 20;

// Campaign-specific apartment options
const BOLTON_APARTMENT_OPTIONS = [
  { id: 'all', label: 'All Apartments' },
  { id: 'Studio Apartment', label: 'Studio Apartment' },
  { id: '1 Bedroom Apartment', label: '1 Bedroom Apartment' },
  { id: '1 Bedroom Penthouse', label: '1 Bedroom Penthouse' },
  { id: '2 Bedroom Penthouse', label: '2 Bedroom Penthouse' },
];

const AURA_APARTMENT_OPTIONS = [
  { id: 'all', label: 'All Apartments' },
  { id: 'Studio Apartment', label: 'Studio Apartment' },
  { id: '1 Bedroom 1 Bathroom Apartment', label: '1 Bed 1 Bath' },
  { id: '2 Bedroom 1 Bathroom Apartment', label: '2 Bed 1 Bath' },
  { id: '2 Bedroom 2 Bathroom Apartment', label: '2 Bed 2 Bath' },
];

const CONTACT_METHOD_OPTIONS = [
  { id: 'all', label: 'All Methods' },
  { id: 'WhatsApp', label: 'WhatsApp' },
  { id: 'Email', label: 'Email' },
  { id: 'Phone Call', label: 'Phone Call' },
];

const BEST_TIME_OPTIONS = [
  { id: 'all', label: 'All Times' },
  { id: 'Morning', label: 'Morning' },
  { id: 'Afternoon', label: 'Afternoon' },
  { id: 'Evening', label: 'Evening' },
  { id: 'Anytime', label: 'Anytime' },
];

const DATE_RANGE_OPTIONS = [
  { id: 'all', label: 'All Time' },
  { id: 'today', label: 'Today' },
  { id: 'last7days', label: 'Last 7 Days' },
  { id: 'last30days', label: 'Last 30 Days' },
  { id: 'thisMonth', label: 'This Month' },
];

// Loading skeleton component
function TableSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="space-y-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex gap-4 py-4 border-b border-border-secondary">
            <div className="h-4 bg-bg-tertiary rounded w-32" />
            <div className="h-4 bg-bg-tertiary rounded w-48" />
            <div className="h-4 bg-bg-tertiary rounded w-28" />
            <div className="h-4 bg-bg-tertiary rounded w-24" />
            <div className="h-4 bg-bg-tertiary rounded w-20" />
            <div className="h-4 bg-bg-tertiary rounded w-36" />
            <div className="h-4 bg-bg-tertiary rounded w-28" />
            <div className="h-4 bg-bg-tertiary rounded w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Format date nicely
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// Format phone for display and make it clickable
function formatPhone(phone: string | null): string {
  if (!phone) return '-';
  return phone;
}

export default function LeadsPage() {
  const { selectedCampaignId, setSelectedCampaignId } = useCampaign();

  // Filter and pagination state
  const [searchQuery, setSearchQuery] = useState('');
  const [apartmentFilter, setApartmentFilter] = useState<ApartmentPreference | 'all'>('all');
  const [contactMethodFilter, setContactMethodFilter] = useState<PreferredContact | 'all'>('all');
  const [bestTimeFilter, setBestTimeFilter] = useState<BestOutreachTime | 'all'>('all');
  const [dateRangeFilter, setDateRangeFilter] = useState<DateRangeFilter>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Selection state for bulk delete
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());

  // Delete dialog state
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'single' | 'bulk'; id?: string } | null>(null);

  // Delete mutations
  const deleteLead = useDeleteLead(selectedCampaignId);
  const deleteLeads = useDeleteLeads(selectedCampaignId);

  // Get campaign-specific apartment options
  const apartmentOptions = selectedCampaignId === 'the-aura'
    ? AURA_APARTMENT_OPTIONS
    : BOLTON_APARTMENT_OPTIONS;

  // Handle search with debounce
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
    // Simple debounce
    setTimeout(() => {
      setDebouncedSearch(value);
    }, 300);
  };

  // Fetch leads
  const { data, isLoading, error } = useLeads(selectedCampaignId, {
    limit: ITEMS_PER_PAGE,
    offset: (currentPage - 1) * ITEMS_PER_PAGE,
    search: debouncedSearch || undefined,
    apartmentFilter: apartmentFilter,
    contactMethodFilter: contactMethodFilter,
    bestTimeFilter: bestTimeFilter,
    dateRangeFilter: dateRangeFilter,
    sortBy: 'submitted_at',
    sortOrder: 'desc',
  });

  const leads = data?.data || [];
  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // Calculate showing range
  const showingFrom = totalCount === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const showingTo = Math.min(currentPage * ITEMS_PER_PAGE, totalCount);

  // Handle filter changes
  const handleApartmentFilterChange = (value: string) => {
    setApartmentFilter(value as ApartmentPreference | 'all');
    setCurrentPage(1);
  };

  const handleContactMethodFilterChange = (value: string) => {
    setContactMethodFilter(value as PreferredContact | 'all');
    setCurrentPage(1);
  };

  const handleBestTimeFilterChange = (value: string) => {
    setBestTimeFilter(value as BestOutreachTime | 'all');
    setCurrentPage(1);
  };

  const handleDateRangeFilterChange = (value: string) => {
    setDateRangeFilter(value as DateRangeFilter);
    setCurrentPage(1);
  };

  // Reset apartment filter when campaign changes (since options are different)
  const handleCampaignChange = (campaignId: string) => {
    setSelectedCampaignId(campaignId);
    setApartmentFilter('all');
    setCurrentPage(1);
  };

  // Pagination handlers
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Get badge color for apartment type
  const getApartmentBadgeColor = (apt: string | null) => {
    if (!apt) return 'gray';
    if (apt.includes('Studio')) return 'blue';
    if (apt.includes('1 Bedroom Apartment')) return 'purple';
    if (apt.includes('1 Bedroom Penthouse')) return 'success';
    if (apt.includes('2 Bedroom')) return 'orange';
    return 'gray';
  };

  // Get badge color for contact method
  const getContactBadgeColor = (method: string | null) => {
    if (!method) return 'gray';
    if (method === 'WhatsApp') return 'success';
    if (method === 'Email') return 'blue';
    if (method === 'Phone Call') return 'purple';
    return 'gray';
  };

  // Selection handlers
  const toggleLeadSelection = (leadId: string) => {
    setSelectedLeads((prev) => {
      const next = new Set(prev);
      if (next.has(leadId)) {
        next.delete(leadId);
      } else {
        next.add(leadId);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedLeads.size === leads.length) {
      setSelectedLeads(new Set());
    } else {
      setSelectedLeads(new Set(leads.map((lead) => lead.id)));
    }
  };

  const isAllSelected = leads.length > 0 && selectedLeads.size === leads.length;
  const isIndeterminate = selectedLeads.size > 0 && selectedLeads.size < leads.length;

  // Delete handlers
  const handleDeleteClick = (leadId: string) => {
    setDeleteTarget({ type: 'single', id: leadId });
  };

  const handleBulkDeleteClick = () => {
    setDeleteTarget({ type: 'bulk' });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      if (deleteTarget.type === 'single' && deleteTarget.id) {
        await deleteLead.mutateAsync(deleteTarget.id);
      } else if (deleteTarget.type === 'bulk') {
        await deleteLeads.mutateAsync(Array.from(selectedLeads));
        setSelectedLeads(new Set());
      }
      setDeleteTarget(null);
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleCloseDialog = () => {
    setDeleteTarget(null);
  };

  const isDeleting = deleteLead.isPending || deleteLeads.isPending;

  return (
    <div className="flex h-full flex-col gap-6 pt-8 pb-12 px-4 lg:px-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-0.5 lg:gap-1">
          <h1 className="text-xl font-semibold text-primary lg:text-display-xs">Lead List</h1>
          <p className="text-md text-tertiary">
            View and manage all leads for your campaigns.
          </p>
        </div>
        <div className="relative z-50 w-full lg:w-64">
          <CampaignSelector
            selectedCampaignId={selectedCampaignId}
            onCampaignChange={handleCampaignChange}
          />
        </div>
      </div>

      {/* Filters */}
      <div
        className="group relative rounded-2xl border border-white/10 p-6 transition-all duration-300 overflow-hidden hover:shadow-xl"
        style={{
          background: 'linear-gradient(135deg, #b6364b 0%, #8e2c3e 50%, #79273a 100%)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.05), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Shimmer effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.1] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-white/90">Search</label>
            <Input
              size="md"
              placeholder="Name, email, or phone..."
              icon={SearchLg}
              value={searchQuery}
              onChange={(value) => handleSearchChange(value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-white/90">Apartment Type</label>
            <Select
              size="md"
              placeholder="Select apartment"
              selectedKey={apartmentFilter}
              onSelectionChange={(key) => handleApartmentFilterChange(key as string)}
              items={apartmentOptions}
              className="w-full"
            >
              {(item) => <Select.Item id={item.id} key={item.id}>{item.label}</Select.Item>}
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-white/90">Contact Method</label>
            <Select
              size="md"
              placeholder="Select method"
              selectedKey={contactMethodFilter}
              onSelectionChange={(key) => handleContactMethodFilterChange(key as string)}
              items={CONTACT_METHOD_OPTIONS}
              className="w-full"
            >
              {(item) => <Select.Item id={item.id} key={item.id}>{item.label}</Select.Item>}
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-white/90">Best Time to Contact</label>
            <Select
              size="md"
              placeholder="Select time"
              selectedKey={bestTimeFilter}
              onSelectionChange={(key) => handleBestTimeFilterChange(key as string)}
              items={BEST_TIME_OPTIONS}
              className="w-full"
            >
              {(item) => <Select.Item id={item.id} key={item.id}>{item.label}</Select.Item>}
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-white/90">Date Range</label>
            <Select
              size="md"
              placeholder="Select range"
              selectedKey={dateRangeFilter}
              onSelectionChange={(key) => handleDateRangeFilterChange(key as string)}
              items={DATE_RANGE_OPTIONS}
              className="w-full"
            >
              {(item) => <Select.Item id={item.id} key={item.id}>{item.label}</Select.Item>}
            </Select>
          </div>
        </div>
      </div>

      <p className="text-sm text-fg-quaternary">
        Showing {showingFrom} - {showingTo} of {totalCount.toLocaleString()} leads
      </p>

      {/* Table Container */}
      <div
        className="flex-1 overflow-hidden rounded-2xl border border-white/20 transition-all duration-300"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05), inset 0 1px 0 0 rgba(255, 255, 255, 0.6)',
        }}
      >
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-6">
              <TableSkeleton />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16">
              <p className="text-lg font-semibold text-fg-primary">Failed to load leads</p>
              <p className="mt-2 text-sm text-fg-tertiary">{error.message}</p>
              <Button
                size="md"
                color="primary"
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          ) : leads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <p className="text-lg font-semibold text-fg-primary">No leads found</p>
              <p className="mt-2 text-sm text-fg-tertiary">
                {searchQuery || apartmentFilter !== 'all' || contactMethodFilter !== 'all' || bestTimeFilter !== 'all' || dateRangeFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Leads will appear here once synced'}
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="border-b border-gray-100">
                  <th className="w-12 px-4 py-4">
                    <Checkbox
                      isSelected={isAllSelected}
                      isIndeterminate={isIndeterminate}
                      onChange={toggleSelectAll}
                      aria-label="Select all leads"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">Phone</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">Best Time</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">Apartment</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">Employment</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">Date</th>
                  <th className="w-16 px-4 py-4 text-center text-xs font-semibold text-gray-700">
                    {selectedLeads.size > 0 ? (
                      <Button
                        size="sm"
                        color="primary-destructive"
                        onClick={handleBulkDeleteClick}
                      >
                        Delete ({selectedLeads.size})
                      </Button>
                    ) : (
                      'Actions'
                    )}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className={`hover:bg-gray-50 transition-colors duration-150 ${
                      selectedLeads.has(lead.id) ? 'bg-blue-50/50' : ''
                    }`}
                  >
                    <td className="w-12 px-4 py-4">
                      <Checkbox
                        isSelected={selectedLeads.has(lead.id)}
                        onChange={() => toggleLeadSelection(lead.id)}
                        aria-label={`Select ${lead.first_name}`}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-fg-primary whitespace-nowrap">
                        {lead.first_name} {lead.last_name || ''}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={`mailto:${lead.email}`}
                        className="text-sm text-fg-brand-primary hover:underline"
                      >
                        {lead.email}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      {lead.phone ? (
                        <a
                          href={`tel:${lead.phone}`}
                          className="text-sm text-fg-brand-primary hover:underline whitespace-nowrap"
                        >
                          {formatPhone(lead.phone)}
                        </a>
                      ) : (
                        <span className="text-sm text-fg-quaternary">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {lead.preferred_contact ? (
                        <Badge size="sm" color={getContactBadgeColor(lead.preferred_contact)}>
                          {lead.preferred_contact}
                        </Badge>
                      ) : (
                        <span className="text-sm text-fg-quaternary">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-fg-tertiary whitespace-nowrap">
                        {lead.best_outreach_time || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {lead.apartment_preference ? (
                        <Badge size="sm" color={getApartmentBadgeColor(lead.apartment_preference)}>
                          {lead.apartment_preference}
                        </Badge>
                      ) : (
                        <span className="text-sm text-fg-quaternary">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-fg-tertiary whitespace-nowrap">
                        {lead.employment_status || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-fg-quaternary whitespace-nowrap">
                        {formatDate(lead.submitted_at)}
                      </span>
                    </td>
                    <td className="w-16 px-4 py-4 text-center">
                      <button
                        onClick={() => handleDeleteClick(lead.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete lead"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!isLoading && !error && totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border-secondary px-6 py-4">
            <Button
              size="sm"
              color="secondary"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="size-4 mr-1" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {/* Show page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`
                      px-3 py-1 text-sm font-medium rounded-lg transition-colors
                      ${currentPage === pageNum
                        ? 'bg-bg-brand-solid text-white'
                        : 'text-fg-tertiary hover:bg-bg-secondary'
                      }
                    `}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <Button
              size="sm"
              color="secondary"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="size-4 ml-1" />
            </Button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteTarget !== null}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmDelete}
        title={deleteTarget?.type === 'bulk' ? 'Delete Leads' : 'Delete Lead'}
        message={
          deleteTarget?.type === 'bulk'
            ? `Are you sure you want to delete ${selectedLeads.size} lead${selectedLeads.size > 1 ? 's' : ''}? This action cannot be undone.`
            : 'Are you sure you want to delete this lead? This action cannot be undone.'
        }
        isLoading={isDeleting}
      />
    </div>
  );
}
