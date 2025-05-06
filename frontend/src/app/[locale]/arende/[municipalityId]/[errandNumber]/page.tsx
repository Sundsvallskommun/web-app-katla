'use client';
import { RegisterHeader } from '@app/[locale]/registrera/register-errand-header.component';
import { AboutErrand } from '@components/errandinformation/about-errand.component';
import { Applicant } from '@components/errandinformation/applicant.component';
import { ExternalCircumstances } from '@components/errandinformation/external-circumstances.component';
import { HealthCareStaff } from '@components/errandinformation/healthcare-staff.component';
import { MedicalOpinion } from '@components/errandinformation/medical-opinion.component';
import { OtherParties } from '@components/errandinformation/other-parties.component';
import { PersonalInformation } from '@components/errandinformation/personal-information.component';
import FileUploadComponent from '@components/file-upload/file-upload.component';
import { SaveErrandButton } from '@components/save-errand-button.component';
import { AppContext } from '@contexts/app-context-interface';
import { Attachment } from '@interfaces/attachment';
import { IErrand } from '@interfaces/errand';
import { Role } from '@interfaces/role';
import { CasedataOwnerOrContact } from '@interfaces/stakeholder';
import { mapAttachmentsToUploadFiles } from '@services/casedata-attachment-service';
import { getErrandByErrandNumber } from '@services/casedata-errand-service';
import { getMe } from '@services/user-service';
import { useThemeQueries } from '@sk-web-gui/react';
import { usePathname } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

const Arende: React.FC = () => {
  const method = useForm<IErrand>();
  const [healthCareStaff, setHealthCareStaff] = useState<CasedataOwnerOrContact[]>([]);
  const [applicants, setApplicants] = useState<CasedataOwnerOrContact[]>([]);
  const [otherParties, setOtherParties] = useState<CasedataOwnerOrContact[]>([]);
  const { setMunicipalityId, setUser, errand, setErrand, setIsLoading } = useContext(AppContext);

  const pathName = usePathname();
  const { isMaxLargeDevice } = useThemeQueries();
  const errandNumber = pathName.split('/')[3];

  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true);
        const municipality = process.env.NEXT_PUBLIC_MUNICIPALITY_ID || pathName.split('/')[2];
        setMunicipalityId(municipality);

        const user = await getMe();
        setUser(user);

        const res = await getErrandByErrandNumber(municipality, errandNumber);
        if (res.errand) {
          setErrand(res.errand);
          method.reset(res.errand);

          if (res.errand.attachments) {
            const uploadFiles = mapAttachmentsToUploadFiles(res.errand.attachments);
            method.setValue('attachments', uploadFiles as unknown as Attachment[]); // Sätt bilagorna i formuläret
            console.log('Bilagor:', uploadFiles);
          }
          setApplicants(
            res.errand.stakeholders
              .filter((s) => s.roles.includes(Role.APPLICANT))
              .map((applicant) => ({
                ...applicant,
                newEmail: applicant.emails[0]?.value,
                newPhoneNumber: applicant.phoneNumbers[0]?.value,
              }))
          );
        }
      } catch (err) {
        console.error('Error initializing data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
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
              <h1 className="text-h2-lg">Ärende {errand?.errandNumber}</h1>

              {!isMaxLargeDevice && (
                <div className="flex gap-x-md">
                  <SaveErrandButton owners={applicants.concat(otherParties).concat(healthCareStaff)} />
                </div>
              )}
            </header>

            <section
              className={`
            bg-background-content border-1 rounded-12
            ${isMaxLargeDevice ? 'p-[1.6rem]' : 'pt-22 pl-5'}
          `}
            >
              <div className={`${isMaxLargeDevice ? 'mb-[2.0rem]' : 'w-full py-15 px-32'}`}>
                <h2>Grundinformation</h2>
              </div>

              <div className={`${isMaxLargeDevice ? '' : 'px-32'}`}>
                <AboutErrand />
                <HealthCareStaff staff={healthCareStaff} setStaff={setHealthCareStaff} />
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
          <div className="flex flex-col px-12 py-16">
            <SaveErrandButton owners={applicants.concat(otherParties)} />
          </div>
        )}
      </div>
    </FormProvider>
  );
};

export default Arende;
