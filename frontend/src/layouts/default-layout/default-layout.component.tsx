'use client';

import { CasedataFilterSidebarStatusSelector } from '@components/filtering/desktop-filtering/errand-filter-sidebarstatus-selector.component';
import { CaseDataFilter, CaseStatusValues } from '@components/filtering/errand-filter';
import { MainErrandsSidebar } from '@components/main-errands-sidebar/main-errands-sidebar.component';
import { CookieConsent, Link, useThemeQueries } from '@sk-web-gui/react';
import NextLink from 'next/link';
import { useEffect, useState } from 'react';
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

export default function DefaultLayout({ children }: DefaultLayoutProps) {
  const { t } = useTranslation();
  const { isMaxLargeDevice: initialIsMaxLargeDevice } = useThemeQueries();
  const [isMaxLargeDevice, setIsMaxLargeDevice] = useState(initialIsMaxLargeDevice);
  const [open, setOpen] = useState(initialIsMaxLargeDevice ? false : true);
  const casedataFilterForm = useForm<CaseDataFilter>({ defaultValues: CaseStatusValues });

  useEffect(() => {
    const handleResize = () => {
      const isLarge = window.innerWidth <= 960;
      setIsMaxLargeDevice(isLarge);
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    setOpen(isMaxLargeDevice ? false : true);
  }, [isMaxLargeDevice]);

  return (
    <>
      <div className="min-h-screen w-full">
        <div className="flex grow w-full">
          <MainErrandsSidebar
            open={open}
            setOpen={setOpen}
            applicationName="Färdtjänst"
            applicationEnvironment={''}
            isNotificationEnabled={false}
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
