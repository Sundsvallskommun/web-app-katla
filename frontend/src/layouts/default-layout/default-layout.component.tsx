'use client';

import { CaseDataFilter, CaseStatusValues } from '@components/filtering/errand-filter';
import { CasedataFilterSidebarStatusSelector } from '@components/filtering/errand-filter-sidebarstatus-selector.component';
import { MainErrandsSidebar } from '@components/main-errands-sidebar/main-errands-sidebar.component';
import { AppContext } from '@contexts/app-context-interface';
//import { useUserStore } from '@services/user-service/user-service';
import { CookieConsent, Link } from '@sk-web-gui/react';
import NextLink from 'next/link';
//import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface DefaultLayoutProps {
  children: React.ReactNode;
  headerTitle?: string;
  headerSubtitle?: string;
  preContent?: React.ReactNode;
  postContent?: React.ReactNode;
  logoLinkHref?: string;
}

export default function DefaultLayout({
  //headerTitle,
  //headerSubtitle,
  children,
  //preContent = undefined,
  //postContent = undefined,
  //logoLinkHref = '/',
}: DefaultLayoutProps) {
  //const router = useRouter();
  const { t } = useTranslation();

  // const setFocusToMain = () => {
  //   const contentElement = document.getElementById('content');
  //   contentElement?.focus();
  // };

  // const handleLogoClick = () => {
  //   router.push(logoLinkHref);
  // };

  const [open, setOpen] = useState(true);

  const { user } = useContext(AppContext);
  const casedataFilterForm = useForm<CaseDataFilter>({ defaultValues: CaseStatusValues });

  return (
    <>
      <div className="min-h-screen w-full">
        <div className="flex grow w-full">
          <MainErrandsSidebar
            open={open}
            setOpen={setOpen}
            user={{
              firstName: user.firstName,
              lastName: user.lastName,
            }}
            isLoading={false}
            applicationName={'Färdtjänst'}
            applicationEnvironment={''}
            isNotificationEnabled={false}
            // casedataFilterForm={undefined}
            onFilterChange={function (): void {
              throw new Error('Function not implemented.');
            }}
          >
            <FormProvider {...casedataFilterForm}>
              <CasedataFilterSidebarStatusSelector iconButton={!open} />
            </FormProvider>
          </MainErrandsSidebar>
          <div className={`w-full grow flex ${open ? 'pl-[32rem]' : 'pl-[5.6rem]'} transition-all`}>{children}</div>
        </div>
      </div>
      <CookieConsent
        title={t('layout:cookies.title', { app: process.env.NEXT_PUBLIC_APP_NAME })}
        body={
          <p>
            {t('layout:cookies.description')}{' '}
            <NextLink href="/kakor" passHref legacyBehavior>
              <Link>{t('layout:cookies.read_more')}</Link>
            </NextLink>
          </p>
        }
        cookies={[
          {
            optional: false,
            displayName: t('layout:cookies.necessary.displayName'),
            description: t('layout:cookies.necessary.description'),
            cookieName: 'necessary',
          },
          {
            optional: true,
            displayName: t('layout:cookies.func.displayName'),
            description: t('layout:cookies.func.description'),
            cookieName: 'func',
          },
          {
            optional: true,
            displayName: t('layout:cookies.stats.displayName'),
            description: t('layout:cookies.stats.description'),
            cookieName: 'stats',
          },
        ]}
        resetConsentOnInit={false}
        onConsent={() => {
          // FIXME: do stuff with cookies?
          // NO ANO FUNCTIONS
        }}
      />
    </>
  );
}
