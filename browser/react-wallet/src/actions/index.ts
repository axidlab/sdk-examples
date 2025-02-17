import { Dispatch } from "redux";
import { AuthenticationAction } from "../reducers/Authentication";
import {
  CreateCredentialTemplateRequest,
  InsertItemRequest,
  IssueFromTemplateRequest,
  LoginRequest,
  LoginResponse,
  SendRequest,
  ServiceOptions,
  TrinsicService,
  TemplateField,
  SearchCredentialTemplatesRequest,
} from "@trinsic/trinsic/lib/browser";
import { TemplateAction } from "../reducers/Templates";
import { WalletAction } from "../reducers/Wallet";
import { CredentialAction } from "../reducers/Credential";
import { ThunkAction } from "redux-thunk";
import { ActionState, EcosystemType } from "../types";

const serviceOptions = ServiceOptions.fromPartial({
  serverEndpoint: "dev-internal.trinsic.cloud",
});
const service = new TrinsicService(serviceOptions);

export const ERROR = "ERROR";
export const LOGIN = "LOGIN";

function setAuthTokenFromState(getState: () => ActionState) {
  const auth = getState().authentication;
  service.setAuthToken(auth.profile);
}

export function login(
  email: string,
  name: string
): ThunkAction<void, ActionState, undefined, any> {
  return async (dispatch: Dispatch<AuthenticationAction>) => {
    const loginResponse: LoginResponse = await service.account().login(
      LoginRequest.fromPartial({
        email,
        //Change this to your ecosystem id
        ecosystemId: "default",
      })
    );

    dispatch({
      type: LOGIN,
      user: { name, email },
      profile: undefined,
      loginResponse: loginResponse,
    });
  };
}

export const VERIFY_EMAIL = "VERIFY_EMAIL";

export function verifyEmail(
  securityCode: string
): ThunkAction<void, ActionState, undefined, any> {
  return async (
    dispatch: Dispatch<AuthenticationAction>,
    getState: () => ActionState
  ) => {
    const auth = getState().authentication;
    const authToken = await service
      .account()
      .loginConfirm(auth.challenge, securityCode);
    service.setAuthToken(authToken);
    dispatch({
      type: VERIFY_EMAIL,
      user: auth.user,
      profile: authToken,
    });
  };
}

export const LOGOUT = "LOGOUT";

export function logout(): { type: string } {
  localStorage.clear();
  return {
    type: LOGOUT,
  };
}

export const GET_CREDENTIAL_TEMPLATES = "GET_CREDENTIAL_TEMPLATES";

export function getCredentialTemplates(): ThunkAction<
  void,
  ActionState,
  undefined,
  any
> {
  return async (
    dispatch: Dispatch<TemplateAction>,
    getState: () => ActionState
  ) => {
    setAuthTokenFromState(getState);
    let request = SearchCredentialTemplatesRequest.fromPartial({
      query: "select * from c order by c.name",
    });
    let response = await service.template().search(request);
    let items = JSON.parse(response.itemsJson!);

    dispatch({
      type: GET_CREDENTIAL_TEMPLATES,
      items: items,
    });
  };
}

export const CREATE_CREDENTIAL_TEMPLATE = "CREATE_CREDENTIAL_TEMPLATE";

export function createCredentialTemplate(
  name: string,
  fields: { [key: string]: TemplateField }
): ThunkAction<void, ActionState, undefined, any> {
  return async (
    dispatch: Dispatch<TemplateAction>,
    getState: () => ActionState
  ) => {
    setAuthTokenFromState(getState);
    const request = CreateCredentialTemplateRequest.fromPartial({
      name: name,
      fields: fields,
    });

    let response = await service.template().create(request);

    dispatch({
      type: CREATE_CREDENTIAL_TEMPLATE,
      response,
    });
  };
}

export const GET_WALLET_ITEMS = "GET_WALLET_ITEMS";

export function getWalletItems(): ThunkAction<
  void,
  ActionState,
  undefined,
  any
> {
  return async (
    dispatch: Dispatch<WalletAction>,
    getState: () => ActionState
  ) => {
    setAuthTokenFromState(getState);
    let response = await service.wallet().searchWallet();
    let items = response.items!.map((item) => JSON.parse(item));

    dispatch({
      type: GET_WALLET_ITEMS,
      items: items,
    });
  };
}

export const INSERTING_WALLET_ITEM = "INSERTING_WALLET_ITEM";
export const INSERTED_WALLET_ITEM = "INSERTED_WALLET_ITEM";

export function insertWalletItem(
  item: any
): ThunkAction<void, ActionState, undefined, any> {
  return async (
    dispatch: Dispatch<WalletAction>,
    getState: () => ActionState
  ) => {
    setAuthTokenFromState(getState);
    dispatch({
      type: INSERTING_WALLET_ITEM,
    });

    let request = InsertItemRequest.fromPartial({
      itemJson: JSON.stringify(item),
    });

    let response = await service.wallet().insertItem(request);

    dispatch({
      type: INSERTED_WALLET_ITEM,
      itemId: response,
    });
  };
}

export const SEND_CREDENTIAL = "SEND_CREDENTIAL";

export function sendCredential(
  credential: any,
  email: string
): ThunkAction<void, ActionState, undefined, any> {
  return async (
    dispatch: Dispatch<CredentialAction>,
    getState: () => ActionState
  ) => {
    setAuthTokenFromState(getState);
    let request = SendRequest.fromPartial({
      documentJson: JSON.stringify(credential),
      email: email,
    });
    let response = await service.credential().send(request);

    dispatch({
      type: SEND_CREDENTIAL,
      response: response,
    });
  };
}

export const ISSUE_CREDENTIAL = "ISSUE_CREDENTIAL";

export function issueCredential(
  templateId: string,
  values: any
): ThunkAction<void, ActionState, undefined, any> {
  return async (
    dispatch: Dispatch<CredentialAction>,
    getState: () => ActionState
  ) => {
    setAuthTokenFromState(getState);
    let request = IssueFromTemplateRequest.fromPartial({
      templateId: templateId,
      valuesJson: JSON.stringify(values),
    });

    let response = await service.credential().issueFromTemplate(request);

    dispatch({
      type: ISSUE_CREDENTIAL,
      credential: response.documentJson,
    });
  };
}

export const CLOSE_NOTIFICATION = "CLOSE_NOTIFICATION";

export function closeNotification() {
  return {
    type: CLOSE_NOTIFICATION,
  };
}