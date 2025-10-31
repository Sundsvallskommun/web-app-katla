'use client';
import { ErrandActionButtons } from '@components/errand-action-buttons.component';
import { ErrandHeader } from '@components/errand-header/errand-header.component';
import { ErrandReportedTab } from '@components/errand-reported-tab.component';
import FileUploadComponent from '@components/file-upload/file-upload.component';
import { AppContext } from '@contexts/app-context-interface';
import { IErrand } from '@interfaces/errand';
import { emptyErrand } from '@services/casedata-errand-service';
import { getMe } from '@services/user-service';
import { useThemeQueries } from '@sk-web-gui/react';
import { useContext, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

const Registrera: React.FC = () => {
  const method = useForm<IErrand>({
    mode: 'onChange',
    defaultValues: emptyErrand,
  });
  const { setMunicipalityId, setUser } = useContext(AppContext);
  const { isMaxMediumDevice } = useThemeQueries();

  useEffect(() => {
    setMunicipalityId(process.env.NEXT_PUBLIC_MUNICIPALITY_ID || '');
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
              {!isMaxMediumDevice && <ErrandActionButtons className="flex gap-x-md" />}
            </header>

            <section
              className={`
                bg-background-content border-1 rounded-12
                ${isMaxMediumDevice ? 'p-[1.6rem]' : 'pt-22 pl-5'}
              `}
            >
              <ErrandReportedTab />
              <FileUploadComponent />
            </section>
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
  );
};

export default Registrera;
