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
  useUserEmailPageMutation,
} from '../graphql'
import { useToastContext } from '../hooks/use-toast-context'
import Loader from '../components/loader'
import { CreateBriefingFormData, PaperCreateForm } from '../components/paper-create-form'
import NavigationButtonLink from '../components/navigation-button-link'
import { RouteComponentProps } from 'react-router'

export const PaperCreateBriefingPage: React.FunctionComponent<RouteComponentProps> = ({ history }) => {
  const { loading } = useAdminMentorPageQuery()
  const [createMentorMutation] = useCreateMentorMutation()
  const [createPaperMutation] = useCreatePaperMutation()
  const [getUserByEmail] = useUserEmailPageMutation()
  const traineePaperPageData = useTrainerPaperPageDataQuery()

  const { addToast } = useToastContext()
  let mentorId = ''

  if (!traineePaperPageData) {
    return null
  }

  const currentUser = traineePaperPageData?.data?.currentUser as Trainer
  if (!currentUser) {
    return null
  }

  const getUserEmail = async (email: string) => {
    await getUserByEmail({
      variables: {
        email: email,
      },
    }).then((response) => {
      mentorId = response?.data?.getUserByEmail?.id ?? ''
    })
  }

  const createPaper = async (data: CreateBriefingFormData) => {
    await createPaperMutation({
      variables: {
        input: {
          briefing: [],
          client: data.customer,
          mentorId: mentorId,
          traineeId: data.trainee,
          trainerId: currentUser.id,
          periodStart: data.startDateProject,
          periodEnd: data.endDateProject,
          schoolPeriodStart: data.startDateSchool,
          schoolPeriodEnd: data.endDateSchool,
          status: PaperStatus.InProgress,
          subject: data.department,
        },
      },
    }).then((response) => {
      const paperId = response?.data?.createPaper.id
      history.push('/paper/briefing/' + paperId)
    })
  }

  const createMentor = async (data: CreateBriefingFormData) => {
    await getUserEmail(data.emailMentor)
    if (!mentorId) {
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
        updateQueries: {
          AdminMentorPage: (prevData, { mutationResult }) => {
            return {
              ...prevData,
              Mentors: [...prevData.mentors, mutationResult.data?.createMentor],
            }
          },
        },
      })
        .then((result) => {
          mentorId = result?.data?.createMentor?.id ? result?.data?.createMentor?.id : ''
          addToast({
            icon: 'PersonNew',
            title: strings.createMentor.title,
            text: strings
              .formatString(strings.createMentor.success, `${data?.firstNameMentor} ${data?.lastNameMentor}`)
              .toString(),
            type: 'success',
          })
          createPaper(data)
        })
        .catch((exception: GraphQLError) => {
          addToast({
            title: strings.errors.error,
            text: exception.message,
            type: 'error',
          })
        })
    } else {
      await createPaper(data)
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
        <PaperCreateLayout headline={<H1 noMargin>{strings.paper.createBriefing.title}</H1>}>
          {!loading ? <PaperCreateForm trainer={currentUser} blurSubmit={false} submit={createMentor} /> : <Loader />}
        </PaperCreateLayout>
      </Spacer>
    </Template>
  )
}
