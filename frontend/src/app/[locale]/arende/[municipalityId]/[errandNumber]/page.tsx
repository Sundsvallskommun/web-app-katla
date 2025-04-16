'use client';
import { CancelRegistrationButton } from '@components/cancel-registration-button.component';
import { AboutErrand } from '@components/errandinformation/about-errand.component';
import { Applicant } from '@components/errandinformation/applicant.component';
import { ExternalCircumstances } from '@components/errandinformation/external-circumstances.component';
import { HealthCareStaff } from '@components/errandinformation/healthcare-staff.component';
import { MedicalOpinion } from '@components/errandinformation/medical-opinion.component';
import { OtherParties } from '@components/errandinformation/other-parties.component';
import { PersonalInformation } from '@components/errandinformation/personal-information.component';
import { PageHeader } from '@components/page-header.component';
import { RegisterErrandButton } from '@components/register-errand-button.component';
import { SaveErrandButton } from '@components/save-errand-button.component';
import { AppContext } from '@contexts/app-context-interface';
import { IErrand } from '@interfaces/errand';
import { Role } from '@interfaces/role';
import { CasedataOwnerOrContact, Stakeholder } from '@interfaces/stakeholder';
import { getErrandByErrandNumber } from '@services/casedata-errand-service';
import { getMe } from '@services/user-service';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { Button, Divider, FileUpload, Link, Logo, MenuItemGroup, PopupMenu, UserMenu } from '@sk-web-gui/react';
import { usePathname, useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

const menuGroups: MenuItemGroup[] = [
  {
    label: 'Annat',
    elements: [
      {
        label: 'Färgläge',
        element: () => (
          <PopupMenu.Item>
            <PopupMenu position="right" align="start">
              <PopupMenu.Button className="justify-between w-full" leftIcon={<LucideIcon name="palette" />}>
                <span className="w-full flex justify-between">
                  Färgläge
                  <LucideIcon name="chevron-right" />
                </span>
              </PopupMenu.Button>
              <PopupMenu.Panel>{/* <ColorSchemeItems /> TODO */}</PopupMenu.Panel>
            </PopupMenu>
          </PopupMenu.Item>
        ),
      },
      {
        label: 'Logga ut',
        element: () => (
          <PopupMenu.Item>
            <Link key={'logout'} href={`${process.env.NEXT_PUBLIC_API_URL}/saml/logout`} className={`usermenu-item`}>
              <span className="inline">Logga ut</span>
            </Link>
          </PopupMenu.Item>
        ),
      },
    ],
  },
];

const SingleErrandTitle: React.FC<{ errandNumber: string }> = ({ errandNumber }) => (
  <div className="flex items-center gap-24 py-10">
    <a href={`${process.env.NEXT_PUBLIC_BASEPATH}`} title={`Draken - Färdtjänst. Gå till startsidan.`}>
      <Logo variant="symbol" className="h-40" />
    </a>
    <strong className="text-large">Ärende</strong>
    <span className="text-small">{errandNumber ? errandNumber : ''}</span>
  </div>
);

const Arende: React.FC = () => {
  const method = useForm<IErrand>();
  const [applicants, setApplicants] = useState<CasedataOwnerOrContact[]>([]);
  const [otherParties, setOtherParties] = useState<CasedataOwnerOrContact[]>([]);
  const { municipalityId, setMunicipalityId, user, setUser, errand, setErrand, isLoading, setIsLoading } =
    useContext(AppContext);

  const router = useRouter();
  const pathName = usePathname();

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
      <PageHeader
        logo={<SingleErrandTitle errandNumber={errand.errandNumber} />}
        userMenu={
          <div className="flex items-center h-fit">
            <span data-cy="usermenu">
              <UserMenu
                initials={`${user.firstName.charAt(0).toUpperCase()}${user.lastName.charAt(0).toUpperCase()}`}
                menuTitle={`${user.firstName} ${user.lastName}`}
                menuSubTitle=""
                menuGroups={menuGroups}
                buttonSize="sm"
              />
            </span>

            <Divider orientation="vertical" className="mx-24" />

            <Link
              href="#"
              target="_blank"
              data-cy="register-new-errand-button"
              onClick={() => router.push('/registrera')}
            >
              <Button
                color={'primary'}
                variant={'tertiary'}
                rightIcon={<LucideIcon name="external-link" color="primary" variant="tertiary" />}
              >
                Nytt ärende
              </Button>
            </Link>
          </div>
        }
      ></PageHeader>

      <div className="grow shrink overflow-y-hidden">
        <div className="flex justify-end w-full h-full">
          <div className="flex justify-center overflow-y-auto w-full grow max-lg:mr-[5.6rem]">
            <main className="flex-grow flex justify-center px-24 max-w-[108rem] h-fit w-full pb-40">
              <section className="w-full">
                <header className="flex justify-between mt-md w-full pt-8">
                  <div className="flex-grow">
                    <h1 className="text-h3-sm md:text-h3-md xl:text-h2-lg mb-0 break-words">
                      Ärende {errand.errandNumber}
                    </h1>
                  </div>
                  <div className="flex gap-md">
                    <SaveErrandButton owners={applicants.concat(otherParties)} />
                  </div>
                </header>

                <section className="bg-transparent pt-24 pb-4">
                  <div className="py-12 bg-transparent">
                    <div className="border-1 rounded-12 bg-background-content pt-22 pl-5">
                      <div className="w-full py-[1.5rem] px-32">
                        <h2>Grundinformation</h2>
                      </div>

                      <AboutErrand />
                      <HealthCareStaff />
                      <Applicant owners={applicants} setOwners={setApplicants} />
                      <OtherParties owners={otherParties} setOwners={setOtherParties} />
                      <div className="w-full pb-[2rem] pt-[5rem] px-32">
                        <h2>Ärendeuppgifter</h2>
                      </div>
                      <ExternalCircumstances />
                      <PersonalInformation />
                      <MedicalOpinion />
                      <div className="w-full pb-[2rem] pt-[5rem] px-32 ">
                        <div className="flex justify-between">
                          <div className="flex">
                            <h2>Bilagor</h2>
                          </div>
                          <div>
                            <Button
                              data-cy="add-attachment-button"
                              disabled={false}
                              color="vattjom"
                              rightIcon={<LucideIcon name="upload" size={16} />}
                              inverted
                              size="sm"
                              onClick={() => {}}
                            >
                              Ladda upp bilaga
                            </Button>
                          </div>
                        </div>
                        <div className="w-[68rem] py-[1rem]">
                          <p>
                            Ladda upp andra bilagor av relevans för ansökan. För att kunna ladda upp bilagor behöver du
                            spara ett utkast på ärendet.
                          </p>
                        </div>
                        <FileUpload.List>
                          <FileUpload.ListItem index={0}></FileUpload.ListItem>
                        </FileUpload.List>
                      </div>
                    </div>
                  </div>
                </section>
              </section>
            </main>
          </div>
        </div>
      </div>
    </FormProvider>
  );
};

export default Arende;
