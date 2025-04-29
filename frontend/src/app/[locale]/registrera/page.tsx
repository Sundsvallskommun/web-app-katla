'use client';

import { CancelRegistrationButton } from '@components/cancel-registration-button.component';
import { AboutErrand } from '@components/errandinformation/about-errand.component';
import { Applicant } from '@components/errandinformation/applicant.component';
import { ExternalCircumstances } from '@components/errandinformation/external-circumstances.component';
import { HealthCareStaff } from '@components/errandinformation/healthcare-staff.component';
import { MedicalOpinion } from '@components/errandinformation/medical-opinion.component';
import { OtherParties } from '@components/errandinformation/other-parties.component';
import { PersonalInformation } from '@components/errandinformation/personal-information.component';
import { RegisterErrandButton } from '@components/register-errand-button.component';
import { DraftErrandButton } from '@components/save-draft-errand-button.component';
import { AppContext } from '@contexts/app-context-interface';
import { IErrand } from '@interfaces/errand';
import { CasedataOwnerOrContact } from '@interfaces/stakeholder';
import { getMe } from '@services/user-service';
import { useContext, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { RegisterHeader } from './register-errand-header.component';
import FileUploadComponent from '@components/file-upload/file-upload.component';
import { useThemeQueries } from '@sk-web-gui/react';

const Registrera: React.FC = () => {
  const method = useForm<IErrand>();
  const [applicants, setApplicants] = useState<CasedataOwnerOrContact[]>([]);
  const [otherParties, setOtherParties] = useState<CasedataOwnerOrContact[]>([]);
  const { setMunicipalityId, setUser } = useContext(AppContext);
  const { isMaxLargeDevice } = useThemeQueries();

  useEffect(() => {
    setMunicipalityId(process.env.NEXT_PUBLIC_MUNICIPALITY_ID || '');
    //getAdminUsers().then(setAdministrators);
    getMe().then((user) => setUser(user));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FormProvider {...method}>
      <RegisterHeader />

      <div className="flex flex-col w-full overflow-hidden">
        <main
          className={`
            flex-grow flex justify-center
            ${isMaxLargeDevice ? 'px-[1.6rem] overflow-x-hidden' : 'px-24 overflow-x-auto'}
            ${isMaxLargeDevice ? 'pt-[1.6rem]' : 'pt-24'}
            ${isMaxLargeDevice ? '' : 'pb-40'}
            w-full
          `}
        >
          <section className={`w-full ${!isMaxLargeDevice ? 'max-w-[108rem]' : ''}`}>
            <header
              className={`
                flex justify-between items-center
                ${isMaxLargeDevice ? '' : 'mt-md pt-8 mb-[3.2rem]'}
              `}
            >
              <h1 className={'text-h2-lg'}>Nytt ärende</h1>

              {!isMaxLargeDevice && (
                <div className="flex gap-x-md">
                  <CancelRegistrationButton />
                  <DraftErrandButton owners={applicants.concat(otherParties)} />
                  <RegisterErrandButton owners={applicants.concat(otherParties)} />
                </div>
              )}
            </header>

            <section
              className={`
                bg-background-content border-1 rounded-12
                ${isMaxLargeDevice ? 'p-[1.6rem]' : 'pt-22 pl-5'}
              `}
            >
              <div className={`${isMaxLargeDevice ? 'mb-[2.0rem]' : 'w-full py-[1.5rem] px-32'}`}>
                <h2>Grundinformation</h2>
              </div>
              <div className={`${isMaxLargeDevice ? '' : 'px-32'}`}>
                <AboutErrand />
                <HealthCareStaff />
                <Applicant owners={applicants} setOwners={setApplicants} />
                <OtherParties owners={otherParties} setOwners={setOtherParties} />
              </div>

              <div className={`${isMaxLargeDevice ? 'my-[2.4rem]' : 'w-full pb-[2rem] pt-[5rem] px-32'}`}>
                <h2>Ärendeuppgifter</h2>
              </div>
              <div className={`${isMaxLargeDevice ? '' : 'px-32'}`}>
                <ExternalCircumstances />
                <PersonalInformation />
                <MedicalOpinion />
              </div>

              <FileUploadComponent />
            </section>
          </section>
        </main>
        {isMaxLargeDevice && (
          <div className="flex flex-col gap-[1.6rem] [&>button]:mb-0 px-12 pt-16">
            <RegisterErrandButton owners={applicants.concat(otherParties)} />
            <DraftErrandButton owners={applicants.concat(otherParties)} />
            <CancelRegistrationButton />
          </div>
        )}
      </div>
    </FormProvider>
  );
};

export default Registrera;
