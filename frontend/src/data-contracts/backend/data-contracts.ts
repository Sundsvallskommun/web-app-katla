/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface SsnPayload {
  ssn: string;
}

export interface OrgNrPayload {
  orgNr: string;
}

export interface CLegalForm {
  legalFormCode: string;
  legalFormDescription: string;
}

export interface CAddress {
  city?: string;
  street?: string;
  postcode?: string;
  careOf?: string;
}

export interface CMunicipality {
  municipalityCode: string;
  municipalityName: string;
}

export interface CCounty {
  countyCode: string;
  countyName: string;
}

export interface CLEPostAddress {
  coAdress: string;
  country: string;
  postalCode: string;
  city: string;
  address1: string;
  address2: string;
}

export interface CLEAddress {
  addressArea: string;
  adressNumber: string;
  city: string;
  postalCode: string;
  municipality: string;
  county: string;
}

export interface CLegalEntity2 {
  legalEntityId: string;
  organizationNumber: string;
  name: string;
  postAddress: CLEPostAddress;
  address: CLEAddress;
  phoneNumber: string;
}

export interface CLegalEntity2WithId {
  partyId: string;
  legalEntityId: string;
  organizationNumber: string;
  name: string;
  postAddress: CLEPostAddress;
  address: CLEAddress;
  phoneNumber: string;
}

export interface ExtraParametersDto {
  'application.reason'?: string;
  'application.role'?: ExtraParametersDtoApplicationRoleEnum;
  'application.applicant.capacity'?: string;
  'application.applicant.testimonial'?: ExtraParametersDtoApplicationApplicantTestimonialEnum;
  'application.applicant.signingAbility'?: ExtraParametersDtoApplicationApplicantSigningAbilityEnum;
  'disability.aid'?: string;
  'disability.walkingAbility'?: ExtraParametersDtoDisabilityWalkingAbilityEnum;
  'disability.walkingDistance.beforeRest'?: string;
  'disability.walkingDistance.max'?: string;
  'disability.duration'?: string;
  'disability.canBeAloneWhileParking'?: ExtraParametersDtoDisabilityCanBeAloneWhileParkingEnum;
  'disability.canBeAloneWhileParking.note'?: string;
  'consent.contact.doctor'?: ExtraParametersDtoConsentContactDoctorEnum;
  'consent.view.transportationServiceDetails'?: ExtraParametersDtoConsentViewTransportationServiceDetailsEnum;
  'application.lostPermit.policeReportNumber'?: string;
  'application.renewal.changedCircumstances'?: ExtraParametersDtoApplicationRenewalChangedCircumstancesEnum;
  'application.renewal.expirationDate'?: string;
  'application.renewal.medicalConfirmationRequired'?: string;
  'artefact.permit.number'?: string;
  'artefact.permit.status'?: string;
  'application.supplement.dueDate'?: string;
}

export interface Attachment {
  id?: number;
  category: string;
  name: string;
  note?: string;
  extension: string;
  mimeType: string;
  file?: string;
  version?: number;
  created?: string;
  updated?: string;
  extraParameters?: any;
}

export interface CreateAttachmentDto {
  file?: string;
  category: string;
  extension: string;
  mimeType: string;
  name: string;
  note: string;
  errandNumber: string;
}

export interface LawDTO {
  heading: string;
  sfs: string;
  chapter: string;
  article: string;
}

export interface DecisionDTO {
  id?: number;
  decisionType: string;
  decisionOutcome: string;
  description?: string;
  law: LawDTO[];
  decidedBy?: any;
  decidedAt?: string;
  validFrom?: string;
  validTo?: string;
  attachments?: Attachment[];
  extraParameters?: object;
}

export interface StatusDTO {
  statusType: string;
  description: string;
  created: string;
}

export interface ContactInfo {
  contactType: string;
  value: string;
}

export interface CAddressDTO {
  apartmentNumber?: string;
  addressCategory?: any;
  street?: any;
  houseNumber?: any;
  postalCode?: any;
  city?: any;
  country?: any;
  careOf?: any;
  attention?: any;
  propertyDesignation?: any;
  isZoningPlanArea?: any;
  invoiceMarking?: any;
  location?: any;
}

export interface ContactInformationDTO {
  contactType?: any;
  value?: any;
}

export interface CreateStakeholderDto {
  id?: number;
  type: string;
  roles: any[];
  firstName?: string;
  lastName?: string;
  addresses?: CAddressDTO[];
  contactInformation?: ContactInformationDTO[];
  personalNumber?: string;
  personId?: string;
  organizationName?: string;
  organizationNumber?: string;
  adAccount?: string;
  extraParameters?: object;
}

export interface CreateErrandDto {
  id?: number;
  errandNumber?: string;
  externalCaseId?: string;
  caseType?: string;
  channel?: string;
  priority?: string;
  phase?: string;
  description?: string;
  caseTitleAddition?: string;
  startDate?: string;
  endDate?: string;
  diaryNumber?: string;
  status?: object;
  statusDescription?: string;
  statuses?: any[];
  municipalityId?: string;
  stakeholders?: CreateStakeholderDto[];
  decisions?: string;
  extraParameters?: any[];
  suspension?: object;
  relatesTo?: any[];
  applicationReceived?: string;
}

export interface CPatchErrandDto {
  id?: string;
  externalCaseId?: string;
  status?: object;
  statuses?: any[];
  statusDescription?: string;
  caseType?: string;
  priority?: string;
  stakeholders?: CreateStakeholderDto[];
  phase?: string;
  description?: string;
  caseTitleAddition?: string;
  startDate?: string;
  endDate?: string;
  diaryNumber?: string;
  decisions?: string;
  extraParameters?: any[];
  suspension?: object;
  relatesTo?: any[];
  applicationReceived?: string;
}

export interface CreateErrandNoteDto {
  extraParameters: object;
  title: string;
  text: string;
  noteType: string;
}

export interface CasedataNotificationDto {
  id?: string;
  municipalityId?: string;
  namespace?: string;
  created?: string;
  modified?: string;
  ownerFullName?: string;
  ownerId: string;
  createdBy?: string;
  createdByFullName?: string;
  type: string;
  description: string;
  content?: string;
  expires?: string;
  acknowledged?: string;
  globalAcknowledged?: string;
  errandId: string;
  errandNumber?: string;
}

export interface PatchNotificationDto {
  id?: string;
  errandId?: number;
  ownerId?: string;
  type?: string;
  description?: string;
  content?: string;
  expires?: string;
  acknowledged?: boolean;
  globalAcknowledged?: boolean;
}

export enum ExtraParametersDtoApplicationRoleEnum {
  SELF = 'SELF',
  GUARDIAN = 'GUARDIAN',
  CUSTODIAN = 'CUSTODIAN',
}

export enum ExtraParametersDtoApplicationApplicantTestimonialEnum {
  True = 'true',
  False = 'false',
}

export enum ExtraParametersDtoApplicationApplicantSigningAbilityEnum {
  True = 'true',
  False = 'false',
}

export enum ExtraParametersDtoDisabilityWalkingAbilityEnum {
  True = 'true',
  False = 'false',
}

export enum ExtraParametersDtoDisabilityCanBeAloneWhileParkingEnum {
  True = 'true',
  False = 'false',
}

export enum ExtraParametersDtoConsentContactDoctorEnum {
  True = 'true',
  False = 'false',
}

export enum ExtraParametersDtoConsentViewTransportationServiceDetailsEnum {
  True = 'true',
  False = 'false',
}

export enum ExtraParametersDtoApplicationRenewalChangedCircumstancesEnum {
  Y = 'Y',
  N = 'N',
}
