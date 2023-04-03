import React from 'react'

import {
  PaperCreateLayout,
  H1, Spacer,
} from '@lara/components'
import strings from '../locales/localization'
import {Template} from "../templates/template";
import {GraphQLError} from "graphql/index";
import {
  useAdminMentorPageQuery,
  useCreateMentorMutation
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
  const [mutate] = useCreateMentorMutation()

  const {addToast} = useToastContext()

  const createMentor = async (data: CreateBriefingFormData) => {
    await mutate({
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
        history.push('/paper/briefing')
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
