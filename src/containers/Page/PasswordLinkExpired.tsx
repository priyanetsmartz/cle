import IntlMessages from "../../components/utility/intlMessages";

function PasswordLinkExpired() {
  return (
    <div className="container" style={{ marginTop: '200px' }}>
      <div className="row">
        <div className="col-md-6 offset-md-3" style={{ minHeight: '300px' }}>
          <h3><IntlMessages id="passwordlinkexpired" /></h3>
          <br />

        </div>
      </div>
    </div>
  );
}

export default PasswordLinkExpired;
