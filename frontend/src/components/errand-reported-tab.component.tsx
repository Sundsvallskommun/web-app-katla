'use client';
import { AboutErrand } from '@components/errandinformation/about-errand.component';
import { Applicant } from '@components/errandinformation/applicant.component';
import { ExternalCircumstances } from '@components/errandinformation/external-circumstances.component';
import { HealthCareStaff } from '@components/errandinformation/healthcare-staff.component';
import { MedicalOpinion } from '@components/errandinformation/medical-opinion.component';
import { OtherParties } from '@components/errandinformation/other-parties.component';
import { useThemeQueries } from '@sk-web-gui/react';
import React from 'react';

export const ErrandReportedTab: React.FC = () => {
  const { isMaxMediumDevice } = useThemeQueries();
  return (
    <>
      <div className={`${isMaxMediumDevice ? 'mb-[2.0rem]' : 'w-full py-15 px-32'}`}>
        <h2>Grundinformation</h2>
      </div>

      <div className={`${isMaxMediumDevice ? '' : 'px-32'}`}>
        <AboutErrand />
        <HealthCareStaff />
        <Applicant />
        <OtherParties />
      </div>

      <div className={`${isMaxMediumDevice ? 'my-[2.4rem]' : 'w-full pb-[2rem] pt-[5rem] px-32'}`}>
        <h2>Ärendeuppgifter</h2>
      </div>

      <div className={`${isMaxMediumDevice ? '' : 'px-32'}`}>
        <ExternalCircumstances />
        <MedicalOpinion />
      </div>
    </>
  );
};
