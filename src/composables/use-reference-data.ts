import { useQuery } from '@tanstack/vue-query'

import { memberService } from '@/services/member-service'
import { projectService } from '@/services/project-service'
import { teamService } from '@/services/team-service'
import { userService } from '@/services/user-service'
import type { MemberListQuery, ProjectListQuery, TeamListQuery, UserListQuery } from '@/types/api'

const optionQueryDefaults = {
  pageNo: 1,
  pageSize: 200,
}

export function useUserOptionsQuery(params: Partial<UserListQuery> = {}) {
  return useQuery({
    queryKey: ['option-users', params],
    queryFn: () =>
      userService.getUsers({
        ...optionQueryDefaults,
        ...params,
      }),
    staleTime: 60 * 1000,
  })
}

export function useTeamOptionsQuery(params: Partial<TeamListQuery> = {}) {
  return useQuery({
    queryKey: ['option-teams', params],
    queryFn: () =>
      teamService.getTeams({
        ...optionQueryDefaults,
        ...params,
      }),
    staleTime: 60 * 1000,
  })
}

export function useMemberOptionsQuery(params: Partial<MemberListQuery> = {}) {
  return useQuery({
    queryKey: ['option-members', params],
    queryFn: () =>
      memberService.getMembers({
        ...optionQueryDefaults,
        ...params,
      }),
    staleTime: 60 * 1000,
  })
}

export function useProjectOptionsQuery(params: Partial<ProjectListQuery> = {}) {
  return useQuery({
    queryKey: ['option-projects', params],
    queryFn: () =>
      projectService.getProjects({
        ...optionQueryDefaults,
        ...params,
      }),
    staleTime: 60 * 1000,
  })
}
