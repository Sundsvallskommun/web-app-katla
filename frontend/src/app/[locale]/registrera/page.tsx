'use client';
import { ErrandActionButtons } from '@components/errand-action-buttons.component';
import { ErrandHeader } from '@components/errand-header/errand-header.component';
import { AboutErrand } from '@components/errandinformation/about-errand.component';
import { Applicant } from '@components/errandinformation/applicant.component';
import { ExternalCircumstances } from '@components/errandinformation/external-circumstances.component';
import { HealthCareStaff } from '@components/errandinformation/healthcare-staff.component';
import { MedicalOpinion } from '@components/errandinformation/medical-opinion.component';
import { OtherParties } from '@components/errandinformation/other-parties.component';
import { PersonalInformation } from '@components/errandinformation/personal-information.component';
import FileUploadComponent from '@components/file-upload/file-upload.component';
import { AppContext } from '@contexts/app-context-interface';
import { IErrand } from '@interfaces/errand';
import { CasedataOwnerOrContact } from '@interfaces/stakeholder';
import { getMe } from '@services/user-service';
import { useThemeQueries } from '@sk-web-gui/react';
import { useContext, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

const Registrera: React.FC = () => {
  const method = useForm<IErrand>();
  const [healthCareStaff, setHealthCareStaff] = useState<CasedataOwnerOrContact[]>([]);
  const [applicants, setApplicants] = useState<CasedataOwnerOrContact[]>([]);
  const [otherParties, setOtherParties] = useState<CasedataOwnerOrContact[]>([]);
  const { setMunicipalityId, setUser } = useContext(AppContext);
  const { isMaxMediumDevice } = useThemeQueries();

  useEffect(() => {
    setMunicipalityId(process.env.NEXT_PUBLIC_MUNICIPALITY_ID || '');
    //getAdminUsers().then(setAdministrators);
    getMe().then((user) => setUser(user));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FormProvider {...method}>
      <ErrandHeader />

      <div className="flex flex-col w-full overflow-hidden bg-background-100">
        <main
          className={`
            flex-grow flex justify-center
            ${isMaxMediumDevice ? 'px-[1.6rem] overflow-x-hidden' : 'px-24 overflow-x-auto'}
            ${isMaxMediumDevice ? 'pt-[1.6rem]' : 'pt-24'}
            ${isMaxMediumDevice ? '' : 'pb-40'}
            w-full
          `}
        >
          <section className={`w-full ${!isMaxMediumDevice ? 'max-w-[108rem]' : ''}`}>
            <header
              className={`
                flex justify-between items-center
                ${isMaxMediumDevice ? '' : 'mt-md pt-8 mb-[3.2rem]'}
              `}
            >
              <h1 className={'text-h2-lg'}>Nytt ärende</h1>
              {!isMaxMediumDevice && (
                <ErrandActionButtons
                  className="flex gap-x-md"
                  owners={applicants.concat(otherParties).concat(healthCareStaff)}
                />
              )}
            </header>

            <section
              className={`
                bg-background-content border-1 rounded-12
                ${isMaxMediumDevice ? 'p-[1.6rem]' : 'pt-22 pl-5'}
              `}
            >
              <div className={`${isMaxMediumDevice ? 'mb-[2.0rem]' : 'w-full py-[1.5rem] px-32'}`}>
                <h2>Grundinformation</h2>
              </div>
              <div className={`${isMaxMediumDevice ? '' : 'px-32'}`}>
                <AboutErrand />
                <HealthCareStaff staff={healthCareStaff} setStaff={setHealthCareStaff} />
                <Applicant owners={applicants} setOwners={setApplicants} />
                <OtherParties owners={otherParties} setOwners={setOtherParties} />
              </div>

              <div className={`${isMaxMediumDevice ? 'my-[2.4rem]' : 'w-full pb-[2rem] pt-[5rem] px-32'}`}>
                <h2>Ärendeuppgifter</h2>
              </div>
              <div className={`${isMaxMediumDevice ? '' : 'px-32'}`}>
                <ExternalCircumstances />
                <PersonalInformation />
                <MedicalOpinion />
              </div>

              <FileUploadComponent />
            </section>
            {!isMaxMediumDevice && (
              <div className="flex justify-end mt-md pt-8 mb-[3.2rem]">
                <ErrandActionButtons
                  className="flex gap-x-md"
                  owners={applicants.concat(otherParties).concat(healthCareStaff)}
                />
              </div>
            )}
            {isMaxMediumDevice && (
              <ErrandActionButtons
                className="flex flex-col gap-[1.6rem] [&>button]:mb-0 px-12 py-16"
                owners={applicants.concat(otherParties).concat(healthCareStaff)}
              />
            )}
          </section>
        </main>
      </div>
    </FormProvider>
  );
};

export default Registrera;
