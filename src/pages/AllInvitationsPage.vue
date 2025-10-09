<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <!-- Page Header -->
      <div class="mb-8">
        <div class="flex items-center space-x-3 mb-4">
          <UserPlusIcon class="h-8 w-8 text-blue-600 dark:text-blue-400" />
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            Приглашения в систему
          </h1>
        </div>
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p class="text-lg text-gray-600 dark:text-gray-400">
            Управление приглашениями для регистрации новых пользователей
          </p>
          <button
            type="button"
            @click="handleCreateInvitation"
            class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 dark:focus:ring-offset-gray-900"
          >
            Создать приглашение
          </button>
        </div>
      </div>

      <!-- Search Filters -->
      <InvitationSearchFilters
        :loading="invitationStore.loading"
        :initial-filters="initialFilters"
        @search="handleSearch"
      />

      <!-- Search Results -->
      <InvitationSearchResults
        :invitations="invitationStore.allInvitations"
        :loading="invitationStore.loading"
        :loading-more="invitationStore.loadingMore"
        :empty="!invitationStore.hasSearched && invitationStore.allInvitations.length === 0"
        :can-load-more="invitationStore.canLoadMore"
        :total-results="invitationStore.lastSearchResults?.total"
        :error="invitationStore.error"
        @load-more="handleLoadMore"
        @retry="handleRetrySearch"
        @create-invitation="handleCreateInvitation"
      />

      <!-- Create Invitation Modal -->
      <CreateInvitationModal
        :is-open="showCreateModal"
        :loading="invitationStore.loading"
        @close="handleCloseCreateModal"
        @submit="handleCreateInvitationSubmit"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useInvitationStore } from '@/stores/invitation'
import { 
  UserPlusIcon
} from '@heroicons/vue/24/outline'
import InvitationSearchFilters from '@/components/invitations/InvitationSearchFilters.vue'
import InvitationSearchResults from '@/components/invitations/InvitationSearchResults.vue'
import CreateInvitationModal from '@/components/invitations/CreateInvitationModal.vue'
import type { InvitationSearchFilters as InvitationSearchFiltersType, CreateInvitationRequest } from '@/types/invitation'

// Router
const route = useRoute()
const router = useRouter()

// Stores
const invitationStore = useInvitationStore()

// Modal state
const showCreateModal = ref(false)

// Derived initial filters from URL
const initialFilters = ref<InvitationSearchFiltersType>({
  limit: 10,
  offset: 0,
  userType: undefined,
  isActive: undefined,
})

function parseQueryToFilters(q: Record<string, any>): InvitationSearchFiltersType {
  const filters: InvitationSearchFiltersType = {}
  if (q.userType === 'client' || q.userType === 'specialist') {
    filters.userType = q.userType
  }
  if (q.isActive !== undefined) {
    if (q.isActive === 'true' || q.isActive === true) filters.isActive = true
    else if (q.isActive === 'false' || q.isActive === false) filters.isActive = false
  }
  if (typeof q.id === 'string' && q.id.trim().length > 0) {
    filters.id = q.id
  }
  return filters
}

function filtersToQuery(filters?: InvitationSearchFiltersType) {
  const query: Record<string, any> = {}
  if (!filters) return query
  if (filters.userType) query.userType = filters.userType
  if (filters.isActive !== undefined) query.isActive = String(filters.isActive)
  if (filters.id) query.id = filters.id
  return query
}

// Methods
const handleSearch = async (filters: InvitationSearchFiltersType): Promise<void> => {
  try {
    // Update URL query to make the search shareable
    const query = filtersToQuery({ ...filters, offset: 0 })
    await router.replace({ query })

    await invitationStore.searchInvitations({ ...filters, offset: 0 })
  } catch (error) {
    console.error('Search failed:', error)
  }
}


const handleLoadMore = async (): Promise<void> => {
  try {
    await invitationStore.loadMoreInvitations()
  } catch (error) {
    console.error('Load more failed:', error)
  }
}

const handleRetrySearch = async (): Promise<void> => {
  try {
    await invitationStore.searchInvitations()
  } catch (error) {
    console.error('Retry search failed:', error)
  }
}

const handleCreateInvitation = () => {
  showCreateModal.value = true
}

const handleCloseCreateModal = () => {
  showCreateModal.value = false
}

const handleCreateInvitationSubmit = async (data: CreateInvitationRequest) => {
  try {
    await invitationStore.createInvitation(data)
    showCreateModal.value = false
    
    // Refresh the invitations list to get updated data from server
    await invitationStore.refreshInvitations()
    
    // Show success message
    console.log('Invitation created successfully')
  } catch (error) {
    console.error('Failed to create invitation:', error)
    // Error is already handled by the store
  }
}

// Initialize
onMounted(async () => {
  // Parse filters from URL and run initial search
  const fromQuery = parseQueryToFilters(route.query as Record<string, any>)
  initialFilters.value = {
    limit: fromQuery.limit ?? 10,
    offset: 0,
    userType: fromQuery.userType,
    isActive: fromQuery.isActive,
    id: fromQuery.id,
  }

  // Ensure URL reflects normalized filters for shareability
  const normalizedQuery = filtersToQuery(initialFilters.value)
  if (JSON.stringify(normalizedQuery) !== JSON.stringify(route.query)) {
    await router.replace({ query: normalizedQuery })
  }

  await invitationStore.searchInvitations(initialFilters.value)
})
</script>
