import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from '../../services/auth.service';


const TermContent = `<h2>Terms of Use Agreement</h2>

<p>Welcome! By using this platform managed by Intersective Pty Ltd, you are agreeing to comply with and be bound by the following terms of use. These terms are intended to cover the use of the Practera Platform (the Platform) and activities and tasks closely associated with the use of the Platform. Please review the following terms carefully.  If you do not agree to these terms, you should not progress any further, and/or communicate with your organisation’s program coordinator. </p>
<p><b>1. Acceptance of Agreement.</b>  You agree to the terms and conditions outlined in this Terms of Use Agreement ("Agreement") with respect to the program platform (the "Platform").  This Agreement constitutes the entire and only agreement between us and you, and supersedes all prior or contemporaneous agreements, representations, warranties and understandings with respect to the Platform, the content, products or services provided by or through the Platform, and the subject matter of this Agreement.  This Agreement may be amended at any time by us from time to time without specific notice to you.  The latest Agreement will be posted on the Platform, and you should review this Agreement prior to using the Platform.
</p>

<p><b>2. Copyright.</b>  The content, organization, graphics, design, compilation, magnetic translation, digital conversion and other matters related to the Platform are protected under applicable copyrights, trademarks and other proprietary (including but not limited to intellectual property) rights.  The copying, redistribution, use or publication by you of anysuch matters or any part of the Platform, except as allowed by Section 3, is strictly prohibited.  You do not acquire ownership rights to any content, document or other materials viewed through the Platform.  The posting of information or materials on the Platform does not constitute a waiver of any right in such information and materials.
</p>

<p><b>3. Limited Right to Use.</b>  The viewing, printing or downloading of any content, graphic, form or document from the Platform grants you only a limited, nonexclusive license for use solely by you for your own personal use and not for republication, distribution, assignment, sublicense, sale, preparation of derivative works or other use.  No part of any content, form or document may be reproduced in any form or incorporated into any information retrieval system, electronic or mechanical, other than for your personal use (but not for resale or redistribution).
</p>

<p><b>4. Editing, Deleting and Modification.</b>  We reserve the right in our sole discretion to edit or delete any documents, information or other content appearing on the Platform.
</p>

<p><b>5. Indemnification.</b>  You agree to indemnify, defend and hold us and our partners, staff and affiliates (collectively, "Affiliated Parties") harmless from any liability, loss, claim and expense, including reasonable legal fees, related to your violation of this Agreement or use of the Platform.
</p>

<p><b>6. Nontransferable.</b>  Your right to use the Platform is not transferable.  Any password or right given to you to obtain information or documents is not transferable.
</p>

<p><b>7. Disclaimer and Limits.</b> All responsibility or liability for any damages caused by viruses contained within the electronic file containing the form or document is disclaimed.  WE WILL NOT BE LIABLE TO YOU FOR ANY INCIDENTAL, SPECIAL OR CONSEQUENTIAL DAMAGES OF ANY KIND THAT MAY RESULT FROM USE OF OR INABILITY TO USE OUR PLATFORM.
</p>

<p><b>8. Use of Information.</b>  We reserve the right, and you authorize us, to the use and assignment of all information regarding Platform uses by you and all information provided by you in any manner consistent with our Privacy Policy.
</p>

<p><b>9. Third-Party Access.</b>  We may allow access to the platform, or to any information contained within the platform, to thirdparties in our absolute discretion, subject to our Privacy Policy.
</p>

<p><b>10. Privacy Policy.</b>  Our Privacy Policy, as it may change from time to time, is a part of this Agreement.
</p>

<p><b>11. Links to other Web Sites.</b>  The Site contains links to other Web Sites.  We are not responsible for the content, accuracy or opinions express in such Web Sites, and such Web Sites are not investigated, monitored or checked for accuracy or completeness by us.  Inclusion of any linked Web Site on our Site does not imply approval or endorsement of the linked Web Site by us.  If you decide to leave our Site and access these third-party Sites, you do so at your own risk.
</p>

<p><b>12. License of user content.</b>  You grant Intersective and any other users of the platform, an irrevocable, global and perpetual license to use any and all content submitted into the platform, including, without limitation, your documents, deliverables, assignments, class notes, course outlines, submits, posts, uploads, displays, reviews, suggestions, ideas, solutions, questions, answers, messages, images, videos, texts of any kind, or other materials for any purposes whatsoever, including, without limitation, developing, manufacturing and marketing products and services for commercial purposes, without any payment or compensation to you. You further agree that Intersective may give free access to all of your above mentioned user content to other third parties, including, without limitation, affiliates, distributors, other users or potential users. You waive any legal or moral rights you may have in any User Content you submit, even if such User Content is altered or changed in any manner.
</p>

<h2>Privacy Policy</h2>
<p><b>1. We respect your privacy.</b> As the manager of the program Platform (“The Platform”) Intersective respects your right to privacy and this policy sets out how we collect and treat your personal information. “Personal information” is information we hold which is identifiable as being about you.
</p>

<p><b>2. What personal information we collect.</b> We may collect a range of types of personal information from you, including, but not limited to, the following:</p>
<ul>
  <li>name</li>
  <li>demographic information – eg; age, gender, socio-economic status</li>
  <li>psychographic information – eg personality, interests, attitudes, behaviours and opinions</li>
  <li>educational history</li>
  <li>employment history</li>
  <li>student number</li>
  <li>user ideas and comments</li>
  <li>information from enquiries you have made</li>
  <li>communications between program participants</li>
  <li>assessments marks and details</li>
  <li>digital and multimedia</li>
</ul>
</p>

<p><b>3. How we collect your personal information.</b> We collect personal information from you in a variety of ways, including: when you interact with us electronically or in person; when you access our website; and when we provide our services to you.
</p>

<p><b>4. Use of your personal information.</b> We use your information to provide our service to you. We also use it to improve our service and to notify you of opportunities that we think you might be interested in. We do not provide or sell your information to third parties, except that we may provide your information to our program partners who support the provision of our services to you expressly for the purpose of facilitating the delivery of that service.
</p>

<p><b>5. Disclosure of your personal information overseas.</b> We are likely to disclose your personal information to recipients globally.
</p>

<p><b>6. Security of your personal information.</b> We take reasonable steps to protect your personal information. However we are not liable for any unauthorised access to this information.
</p>

<p><b>7. Access to your personal information.</b> You can access and update your personal information by contacting us on {{helpline}}
</p>

<p><b>8. Complaints about privacy.</b> If you have any complaints about our privacy practices, please feel free to send in details of your complaints to {{helpline}}. We take complaints very seriously and will respond shortly after receiving written notice of your complaint.
</p>

<p><b>9. Changes.</b> Please be aware that we may change this Privacy Policy in the future. The revised versions will be uploaded onto our website, so please check back from time to time.
</p>

<p><b>10. Website.</b></p>
<p><em>When you visit our website</em></p>
<p>When you come on to our website we may collect certain information such as browser type, operating system, website visited immediately before coming to our site, etc. This information is used in an aggregated manner to analyse how people use our site, such that we can improve our service.</p>

<p><em>Cookies</em></p>
<p>As is very common for companies, we use cookies on our website. Cookies are very small files which a website uses to identify you when you come back to the site and to store details about your use of the site. Cookies are not malicious programs that access or damage your computer. We use cookies to improve the experience of people using our website.
Third party sites
Our site has links to other websites not owned or controlled by us. We are not responsible for these sites or the consequences of you going on to those sites.</p>`;

@Component({
  selector: 'term-content',
  template: '<div [innerHTML]="content"></div>'
})
export class TermContentComponent {
  content: string;
  constructor(public sanitizer: DomSanitizer, public authService: AuthService) {
    this.content = TermContent;
  }
}
