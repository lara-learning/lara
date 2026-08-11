import React from 'react'

import { H1, PaperCreateLayout, Spacer } from '@lara/components'
import strings from '../locales/localization'
import { Template } from '../templates/template'
import { GraphQLError } from 'graphql/index'
import {
  PaperStatus,
  Trainer,
  useAdminMentorPageQuery,
  useCreateMentorMutation,
  useCreatePaperMutation,
  useTrainerPaperPageDataQuery,
  useUpdatePaperMutation,
  useUserEmailPageMutation,
} from '../graphql'
import { useToastContext } from '../hooks/use-toast-context'
import Loader from '../components/loader'
import { CreateBriefingFormData, PaperCreateForm } from '../components/paper-create-form'
import NavigationButtonLink from '../components/navigation-button-link'
import { useNavigate, useParams } from 'react-router'
import { omitDeep } from '@apollo/client/utilities'

export const PaperCreateBriefingPage: React.FunctionComponent = () => {
  const navigate = useNavigate()
  const { paperId } = useParams()
  const isEditMode = Boolean(paperId)

  const { loading, data: mentorPageData } = useAdminMentorPageQuery()
  const [createMentorMutation] = useCreateMentorMutation()
  const [createPaperMutation] = useCreatePaperMutation()
  const [updatePaperMutation] = useUpdatePaperMutation()
  const [getUserByEmail] = useUserEmailPageMutation()
  const traineePaperPageData = useTrainerPaperPageDataQuery({
    fetchPolicy: 'network-only',
  })

  const { addToast } = useToastContext()

  if (!traineePaperPageData) {
    return null
  }

  const currentUser = traineePaperPageData?.data?.currentUser as Trainer

  if (!currentUser) {
    return null
  }

  const papers = Array.isArray(currentUser?.papers) ? currentUser.papers : []
  const mentors = Array.isArray(mentorPageData?.mentors) ? mentorPageData.mentors : []

  const paper = papers.find((existingPaper) => existingPaper?.id === paperId)
  const mentor = mentors.find((existingMentor) => existingMentor?.id === paper?.mentorId)

  if (isEditMode && !paper) {
    return (
      <Template type="Main">
        <Loader />
      </Template>
    )
  }

  if (isEditMode && paper?.trainerId !== currentUser.id) {
    navigate('/paper')
    return null
  }

  const resolveMentorIdByEmail = async (email: string): Promise<string> => {
    const response = await getUserByEmail({ variables: { email } })
    return response?.data?.getUserByEmail?.id ?? ''
  }

  const createPaper = async (data: CreateBriefingFormData, resolvedMentorId: string) => {
    await createPaperMutation({
      variables: {
        input: {
          briefing: [],
          feedbackTrainee: [],
          feedbackMentor: [],
          client: data.customer,
          mentorId: resolvedMentorId,
          traineeId: data.trainee,
          trainerId: currentUser.id,
          periodStart: data.startDateProject,
          periodEnd: data.endDateProject,
          schoolPeriodStart: data.startDateSchool,
          schoolPeriodEnd: data.endDateSchool,
          status: PaperStatus.NotStarted,
          subject: data.department,
        },
      },
    }).then((response) => {
      const createdPaperId = response?.data?.createPaper.id
      navigate('/paper/briefing/' + createdPaperId)
    })
  }

  const updatePaper = async (data: CreateBriefingFormData) => {
    let updatedMentorId = paper?.mentorId ?? ''

    const shouldChangeMentor =
      data.emailMentor.trim() !== '' && data.firstNameMentor.trim() !== '' && data.lastNameMentor.trim() !== ''

    if (shouldChangeMentor) {
      const existingMentorId = await resolveMentorIdByEmail(data.emailMentor)

      if (!existingMentorId) {
        await createMentorMutation({
          variables: {
            input: {
              email: data.emailMentor,
              endDate: data.endDateProject,
              firstName: data.firstNameMentor,
              lastName: data.lastNameMentor,
              startDate: data.startDateProject,
            },
          },
        })
          .then((result) => {
            updatedMentorId = result?.data?.createMentor?.id ?? paper?.mentorId ?? ''
          })
          .catch((exception: GraphQLError) => {
            addToast({
              title: strings.errors.error,
              text: exception.message,
              type: 'error',
            })
          })
      } else {
        updatedMentorId = existingMentorId
      }
    }

    const result = await updatePaperMutation({
      variables: {
        input: {
          id: paperId ?? '',
          briefing: paper ? omitDeep(paper.briefing, '__typename') : [],
          feedbackTrainee: paper ? omitDeep(paper.feedbackTrainee, '__typename') : [],
          feedbackMentor: paper ? omitDeep(paper.feedbackMentor, '__typename') : [],
          client: data.customer,
          mentorId: updatedMentorId,
          traineeId: data.trainee,
          trainerId: currentUser.id,
          periodStart: data.startDateProject,
          periodEnd: data.endDateProject,
          schoolPeriodStart: data.startDateSchool,
          schoolPeriodEnd: data.endDateSchool,
          status: paper?.status ?? PaperStatus.NotStarted,
          subject: data.department,
        },
      },
    })

    const updatedPaperId = result?.data?.updatePaper?.id ?? paperId

    await traineePaperPageData.refetch()

    navigate('/paper/briefing/' + updatedPaperId)
  }

  const createMentor = async (data: CreateBriefingFormData) => {
    const existingMentorId = await resolveMentorIdByEmail(data.emailMentor)

    if (!existingMentorId) {
      await createMentorMutation({
        variables: {
          input: {
            email: data.emailMentor,
            endDate: data.endDateProject,
            firstName: data.firstNameMentor,
            lastName: data.lastNameMentor,
            startDate: data.startDateProject,
          },
        },
      })
        .then((result) => {
          const newMentorId = result?.data?.createMentor?.id ?? ''

          addToast({
            icon: 'PersonNew',
            title: strings.createMentor.title,
            text: strings
              .formatString(strings.createMentor.success, `${data?.firstNameMentor} ${data?.lastNameMentor}`)
              .toString(),
            type: 'success',
          })

          createPaper(data, newMentorId)
        })
        .catch((exception: GraphQLError) => {
          addToast({
            title: strings.errors.error,
            text: exception.message,
            type: 'error',
          })
        })
    } else {
      await createPaper(data, existingMentorId)
    }
  }

  return (
    <Template type="Main">
      <NavigationButtonLink
        label={strings.back}
        to="/paper"
        icon="ChevronLeft"
        isLeft
        alignLeft
        iconColor="iconLightGrey"
      />
      <Spacer top="m">
        <PaperCreateLayout
          headline={<H1 noMargin>{isEditMode ? strings.edit : strings.paper.createBriefing.title}</H1>}
        >
          {!loading ? (
            <PaperCreateForm
              key={`${paper?.id ?? 'new'}-${mentor?.id ?? 'no-mentor'}`}
              trainer={currentUser}
              blurSubmit={false}
              submit={isEditMode ? updatePaper : createMentor}
              submitButtonLabel={isEditMode ? strings.save : strings.continue}
              isEditMode={isEditMode}
              initialData={
                isEditMode && paper
                  ? {
                      trainee: paper.traineeId ?? '',
                      firstNameMentor: mentor?.firstName ?? '',
                      lastNameMentor: mentor?.lastName ?? '',
                      emailMentor: '',
                      customer: paper.client ?? '',
                      startDateProject: paper.periodStart ?? '',
                      endDateProject: paper.periodEnd ?? '',
                      startDateSchool: paper.schoolPeriodStart ?? '',
                      endDateSchool: paper.schoolPeriodEnd ?? '',
                      department: paper.subject ?? '',
                    }
                  : undefined
              }
            />
          ) : (
            <Loader />
          )}
        </PaperCreateLayout>
      </Spacer>
    </Template>
  )
}
