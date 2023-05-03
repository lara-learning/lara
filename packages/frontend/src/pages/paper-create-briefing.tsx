import React from 'react'

import {H1, PaperCreateLayout, Spacer,} from '@lara/components'
import strings from '../locales/localization'
import {Template} from "../templates/template";
import {GraphQLError} from "graphql/index";
import {
  PaperStatus,
  useAdminMentorPageQuery,
  useCreateMentorMutation,
  useCreatePaperMutation
} from "../graphql";
import {useToastContext} from "../hooks/use-toast-context";
import Loader from "../components/loader";
import {
  CreateBriefingFormData,
  PaperCreateForm
} from "../components/paper-create-form";
import NavigationButtonLink from "../components/navigation-button-link";
import {RouteComponentProps} from "react-router";

export const PaperCreateBriefing: React.FunctionComponent<RouteComponentProps>  = ({history}) => {

  const {loading} = useAdminMentorPageQuery()
  const [createMentorMutation] = useCreateMentorMutation()
  const [createPaperMutation] = useCreatePaperMutation()

  const {addToast} = useToastContext()

  const createPaper = async (data: CreateBriefingFormData) => {
    await createPaperMutation({
      variables: {
        input: {
          briefing: [],
          client: data.customer,
          mentorId: "1011",
          traineeId: "123",
          trainerId: "456",
          //TODO
          periodStart: "2022-08-07T05:14:28.000Z",
          periodEnd: "2022-08-07T05:14:28.000Z",
          status: PaperStatus.InProgress,
          subject: data.department,

        }
      },
    })
      .then(() => {
        console.log("drrtdt")
        history.push('/paper/briefing')
      })
  }
  const createMentor = async (data: CreateBriefingFormData) => {
    await createMentorMutation({
      variables: {
        input: {
          email: data.emailMentor,
          endDate: data.endDateProjectInput,
          firstName: data.firstNameMentor,
          lastName: data.lastNameMentor,
          startDate: data.startDateProjectInput,
        }
      },
      updateQueries: {
        AdminMentorPage: (prevData, {mutationResult}) => {
          return {
            ...prevData,
            Mentors: [...prevData.mentors, mutationResult.data?.createMentor],
          }
        },
      },
    })
      .then(() => {
        addToast({
          icon: 'PersonNew',
          title: strings.createMentor.title,
          text: strings.formatString(strings.createMentor.success, `${data?.firstNameMentor} ${data?.lastNameMentor}`).toString(),
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
  }
  //TODO company hinzufügen

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
          headline={<H1 noMargin>{strings.paper.createBriefing.title}</H1>}
        >
          {!loading ? (
            <PaperCreateForm blurSubmit={false} submit={createMentor}
            />
          ) : (
            <Loader/>
          )}
        </PaperCreateLayout>
      </Spacer>
    </Template>
  )
}
