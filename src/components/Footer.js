export default function Footer() {
    return (
        <div>
            <footer className="footer-distributed">
                <div className="footer-left">
                    <img src='https://map.treetracker.org/images/treetracker_logo.svg' style={{ height: '40px' }} />
                    <h6 className='greenStand'>by Greenstand</h6>
                    <div className='footer-links'>
                        <a href="#" className="link-1">About Greenstand</a>
                        <a href="#">About Treetracker</a>
                        <a href="#">Contribute</a>
                        <a href="#">Blog</a>
                    </div>
                    <div>
                        <h6>Contact Us</h6>
                        <input placeholder='Enter your e-mail' className='input_block' />
                        <button className='submit_button'>Submit</button>
                    </div>
                </div>
                <div className="footer-center">
                    <div>
                        <i className="fa fa-map-marker"></i>
                        <p><span>444 S. Cedros Ave</span> Solana Beach, California</p>
                    </div>

                    <div>
                        <i className="fa fa-phone"></i>
                        <p>+1.555-555-5555</p>
                    </div>

                    <div>
                        <i className="fa fa-envelope"></i>
                        <p><a href="mailto:support@company.com">support@company.com</a></p>
                    </div>

                </div>

                <div className="footer-right">

                    <p className="footer-company-about">
                        <span>About the company</span>
                        Lorem ipsum dolor sit amet, consectateur adispicing elit. Fusce euismod convallis velit, eu auctor lacus vehicula sit amet.
                    </p>

                    <div className="footer-icons">

                        <a href="#"><i className="fa fa-facebook"></i></a>
                        <a href="#"><i className="fa fa-twitter"></i></a>
                        <a href="#"><i className="fa fa-linkedin"></i></a>
                        <a href="#"><i className="fa fa-github"></i></a>

                    </div>

                </div>

            </footer>
        </div>
    )
}