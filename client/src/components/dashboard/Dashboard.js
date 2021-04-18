import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { getCurrentProfile } from '../../actions/profile';
function Dashboard({ getCurrentProfile, auth, profile }) {
  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile]);
  return <div>Dashboard </div>;
}
const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});
export default connect(mapStateToProps, { getCurrentProfile })(Dashboard);
