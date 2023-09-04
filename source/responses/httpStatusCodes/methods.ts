export const METHODS = {
  /**
   * Requests that the recipient establish a tunnel to the destination origin server identified by the request-target and, if successful, thereafter restrict its behavior to blind forwarding of packets, in both directions, until the connection is closed."
   */
  CONNECT: 'CONNECT',
  /**
   * Requests that the origin server remove the association between the target resource and its current functionality."
   */
  DELETE: 'DELETE',
  /**
   * Requests transfer of a current selected representation for the target resource."
   */
  GET: 'GET',
  /**
   * Is identical to GET except that the server MUST NOT send a message body in the response (i.e., the response terminates at the end of the header block)."
   */
  HEAD: 'HEAD',
  /**
   * Requests information about the communication options available on the request/response chain identified by the effective request URI."
   */
  OPTIONS: 'OPTIONS',
  /**
   * Requests that the target resource process the representation enclosed in the request according to the resource's own specific semantics."
   */
  POST: 'POST',
  /**
   * Requests that the state of the target resource be created or replaced with the state defined by the representation enclosed in the request message payload."
   */
  PUT: 'PUT',
  /**
   * Is used to invoke a remote, application-layer loopback of the request message."
   */
  TRACE: 'TRACE',
  /**
   */
  ACL: 'ACL',
  /**
   */
  'BASELINE-CONTROL': 'BASELINE-CONTROL',
  /**
   */
  BIND: 'BIND',
  /**
   */
  CHECKIN: 'CHECKIN',
  /**
   */
  CHECKOUT: 'CHECKOUT',
  /**
   */
  COPY: 'COPY',
  /**
   */
  LABEL: 'LABEL',
  /**
   */
  LINK: 'LINK',
  /**
   */
  LOCK: 'LOCK',
  /**
   */
  MERGE: 'MERGE',
  /**
   */
  MKACTIVITY: 'MKACTIVITY',
  /**
   */
  MKCALENDAR: 'MKCALENDAR',
  /**
   */
  MKCOL: 'MKCOL',
  /**
   */
  MKREDIRECTREF: 'MKREDIRECTREF',
  /**
   */
  MKWORKSPACE: 'MKWORKSPACE',
  /**
   */
  MOVE: 'MOVE',
  /**
   */
  ORDERPATCH: 'ORDERPATCH',
  /**
   * Requests that a set of changes described in the request entity be applied to the resource identified by the Request-URI."
   */
  PATCH: 'PATCH',
  /**
   */
  PROPFIND: 'PROPFIND',
  /**
   */
  PROPPATCH: 'PROPPATCH',
  /**
   */
  REBIND: 'REBIND',
  /**
   */
  REPORT: 'REPORT',
  /**
   */
  SEARCH: 'SEARCH',
  /**
   */
  UNBIND: 'UNBIND',
  /**
   */
  UNCHECKOUT: 'UNCHECKOUT',
  /**
   */
  UNLINK: 'UNLINK',
  /**
   */
  UNLOCK: 'UNLOCK',
  /**
   */
  UPDATE: 'UPDATE',
  /**
   */
  UPDATEREDIRECTREF: 'UPDATEREDIRECTREF',
  /**
   */
  'VERSION-CONTROL': 'VERSION-CONTROL',
};
