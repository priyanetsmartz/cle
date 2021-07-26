import IntlMessages from "../../components/utility/intlMessages";

function PasswordLinkExpired() {
    return (
        <>
          <div className="row">
            <div className="col-md-12 text-center">
              <h3><IntlMessages id="passwordlinkexpired" /></h3> 
            </div>
          </div>
        </>
    );
}

export default PasswordLinkExpired;
