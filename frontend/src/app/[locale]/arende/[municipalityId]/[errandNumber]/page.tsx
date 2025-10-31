'use client';
import { ErrandActionButtons } from '@components/errand-action-buttons.component';
import { ErrandHeader } from '@components/errand-header/errand-header.component';
import { ErrandReportedTab } from '@components/errand-reported-tab.component';
import FileUploadComponent from '@components/file-upload/file-upload.component';
import { CasedataMessagesTab } from '@components/messages/message.component';
import { AppContext } from '@contexts/app-context-interface';
import { Attachment } from '@interfaces/attachment';
import { IErrand } from '@interfaces/errand';
import { ErrandStatus } from '@interfaces/errand-status';
import { CasedataOwnerOrContact } from '@interfaces/stakeholder';
import { mapAttachmentsToUploadFiles } from '@services/casedata-attachment-service';
import { getErrandByErrandNumber } from '@services/casedata-errand-service';
import { EXTRAPARAMETER_SEPARATOR } from '@services/casedata-extra-parameters-service';
import { getMe } from '@services/user-service';
import { Divider, MenuBar, useThemeQueries } from '@sk-web-gui/react';
import { isErrandReadOnly } from '@utils/errand-utils';
import { usePathname } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

const Arende: React.FC = () => {
  const method = useForm<IErrand>();
  const [current, setCurrent] = React.useState<number | undefined>(0);
  const [healthCareStaff, setHealthCareStaff] = useState<CasedataOwnerOrContact[]>([]);
  const [applicants, setApplicants] = useState<CasedataOwnerOrContact[]>([]);
  const [otherParties, setOtherParties] = useState<CasedataOwnerOrContact[]>([]);
  const [forbidden, setForbidden] = useState(false);
  const { setMunicipalityId, setUser, errand, setErrand, setIsLoading } = useContext(AppContext);

  const pathName = usePathname();
  const { isMaxMediumDevice } = useThemeQueries();
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

        if (res.error) {
          setForbidden(true);
        }

        if (res.errand) {
          setErrand(res.errand);
          method.reset(res.errand);

          res.errand.extraParameters?.forEach((param) => {
            const key = param.key.replace(/\./g, EXTRAPARAMETER_SEPARATOR);
            const values = param.values;

            if (!Array.isArray(values)) return;

            const valueToSet =
              values.length > 1 ? values
              : values.length === 1 ? values[0]
              : '';

            method.setValue(`extraParameterValues.${key}`, valueToSet);
          });

          if (res.errand.attachments) {
            const uploadFiles = mapAttachmentsToUploadFiles(res.errand.attachments);
            method.setValue('attachments', uploadFiles as unknown as Attachment[]);
          }
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
    <>
      {forbidden ?
        <>
          <ErrandHeader />

          <div className="flex flex-col w-full min-h-screen overflow-hidden bg-background-100">
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
            flex justify-center items-center
            ${isMaxMediumDevice ? '' : 'mt-md pt-8 mb-[3.2rem]'}
          `}
                >
                  <h1 className="text-h2-lg">Ärende {errandNumber} kunde inte hämtas</h1>
                </header>
              </section>
            </main>
          </div>
        </>
      : <FormProvider {...method}>
          <ErrandHeader />

          <div className="flex flex-col w-full min-h-screen overflow-hidden bg-background-100">
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
                  <h1 className="text-h2-lg">Ärende {errand?.errandNumber}</h1>

                  {!isMaxMediumDevice && <ErrandActionButtons className="flex gap-x-md" />}
                </header>
                <div className="border-1 rounded-12 bg-background-content">
                  <MenuBar className="py-[1rem] pl-[1.6rem]" current={current}>
                    <MenuBar.Item>
                      <button onClick={() => setCurrent(0)}>Rapporterat</button>
                    </MenuBar.Item>
                    {errand?.status?.statusType != ErrandStatus.Utkast && (
                      <MenuBar.Item>
                        <button onClick={() => setCurrent(1)}>Meddelanden</button>
                      </MenuBar.Item>
                    )}
                    {!isErrandReadOnly(errand) && (
                      <MenuBar.Item>
                        <button onClick={() => setCurrent(2)}>Bilagor</button>
                      </MenuBar.Item>
                    )}
                  </MenuBar>
                  <Divider />
                  <section
                    className={`
            ${isMaxMediumDevice ? 'p-[1.6rem]' : 'pt-22 pl-5'}
          `}
                  >
                    {current === 0 && <ErrandReportedTab />}

                    {current === 1 && <CasedataMessagesTab setUnsaved={() => {}} update={() => {}} />}
                    {current === 2 && <FileUploadComponent />}
                  </section>
                </div>
                {!isMaxMediumDevice && (
                  <div className="flex justify-end mt-md pt-8 mb-[3.2rem]">
                    <ErrandActionButtons className="flex gap-x-md" />
                  </div>
                )}
                {isMaxMediumDevice && (
                  <ErrandActionButtons className="flex flex-col gap-[1.6rem] [&>button]:mb-0 px-12 py-16" />
                )}
              </section>
            </main>
          </div>
        </FormProvider>
      }
    </>
  );
};

export default Arende;
