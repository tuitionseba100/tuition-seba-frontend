import React, { useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaShieldAlt, FaUserTie, FaMoneyCheckAlt, FaUndoAlt, FaLock, FaPhoneAlt, FaWhatsapp } from 'react-icons/fa';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';

const Rules = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const ruleCards = [
        {
            title: "শর্তাবলী ও নীতিমালা",
            subtitle: "Terms & Conditions",
            icon: <FaShieldAlt size={32} />,
            color: "#0d6efd",
            content: (
                <div className="rules-content">
                    <p className="intro-text">Tuition Seba Forum</p>
                    <p className="mb-4">Tuition Seba Forum একটি অনলাইন টিউশন সংযোগ ও ম্যাচিং প্ল্যাটফর্ম। আমাদের ওয়েবসাইট, অ্যাপ বা সেবা ব্যবহার করার মাধ্যমে ব্যবহারকারী নিম্নোক্ত শর্তাবলীতে সম্মত হন।</p>

                    <div className="rule-section">
                        <h6><span className="section-num">১</span> সেবার প্রকৃতি</h6>
                        <ul>
                            <li>১.১ প্রতিষ্ঠান শুধুমাত্র শিক্ষক ও অভিভাবকের মধ্যে সংযোগ স্থাপন করে।</li>
                            <li>১.২ প্রতিষ্ঠান সরাসরি শিক্ষাদান বা শিক্ষার ফলাফলের জন্য দায়ী নয়।</li>
                            <li>১.৩ শিক্ষক ও অভিভাবকের মধ্যকার যেকোনো চুক্তি তাদের নিজস্ব দায়িত্বে সম্পন্ন হবে। আমরা ওয়েবসাইটে যেসব তথ্য প্রদান করা হয় তা উভয় পক্ষ প্রথম দিনে সাক্ষাৎকারের সময় মিলিয়ে নিবেন।</li>
                        </ul>
                    </div>

                    <div className="rule-section">
                        <h6><span className="section-num">২</span> সদস্যপদ ও যোগ্যতা</h6>
                        <ul>
                            <li>২.১ টিউশন গ্রহণের পূর্বে রেজিস্ট্রেশন বায়োডাটা ও Teacher ID বাধ্যতামূলক।</li>
                            <li>২.২ প্রদত্ত তথ্য সঠিক, হালনাগাদ ও সত্য হতে হবে।</li>
                            <li>২.৩ ভুয়া বা বিভ্রান্তিকর তথ্য প্রদান করলে অ্যাকাউন্ট বাতিল করা হতে পারে।</li>
                            <li>২.৪ অভিভাবক ও শিক্ষক উভয়ের মধ্যে কেউ ভুয়া তথ্য প্রদান করলে টিউশন সেবা ফোরাম এর জন্য দায়ী থাকবে না।</li>
                        </ul>
                    </div>

                    <div className="rule-section">
                        <h6><span className="section-num">৩</span> Media Fee ও পেমেন্ট নীতি</h6>
                        <p className="small-text mb-2">পেমেন্ট অপশনে বিস্তারিত পাবেন তা মেনে চলা হবে।</p>
                        <ul>
                            <li>৩.১ Media Fee প্রথম মাসের বেতনের নির্ধারিত শতাংশ অনুযায়ী প্রযোজ্য হবে।</li>
                            <li>৩.২ নির্ধারিত ফি পরিশোধের পূর্বে অভিভাবকের তথ্য শেয়ার করা হবে না।</li>
                            <li>৩.৩ অগ্রিম ও বকেয়া ফি নির্ধারিত সময়ে পরিশোধ করতে হবে।</li>
                            <li>৩.৪ প্ল্যাটফর্মের বাইরে গোপন লেনদেন গ্রহণযোগ্য নয়।</li>
                            <li>৩.৫ শিক্ষক ও অভিভাবক আমাদেরকে না জানিয়ে কোনো চুক্তিবদ্ধ হলে টিউশন সেবা ফোরাম দায়ী থাকবে না।</li>
                        </ul>
                    </div>

                    <div className="rule-section">
                        <h6><span className="section-num">৪</span> ডেমো ও কনফার্মেশন</h6>
                        <ul>
                            <li>৪.১ সর্বোচ্চ দুইটি ডেমো ক্লাস প্রদান করা যাবে।</li>
                            <li>৪.২ ডেমোর পর উভয় পক্ষ সন্তুষ্ট হলে টিউশন কনফার্ম হবে।</li>
                            <li>৪.৩ কনফার্মের পর নিজ থেকে বাতিল করলে প্রযোজ্য ফি প্রদান করতে হবে।</li>
                        </ul>
                    </div>

                    <div className="rule-section">
                        <h6><span className="section-num">৫</span> রিফান্ড নীতি</h6>
                        <p className="small-text mb-2">বিস্তারিত পেমেন্ট অপশনে মেনে চলা হবে।</p>
                        <ul>
                            <li>৫.১ প্রতিষ্ঠানের তথ্যগত ভুল হলে সম্পূর্ণ ফি ফেরতযোগ্য।</li>
                            <li>৫.২ টিউশন কনফার্ম না হলে অগ্রিম ফি ফেরতযোগ্য।</li>
                            <li>৫.৩ রিফান্ড আবেদন করার পর সর্বোচ্চ ৭২ ঘণ্টার মধ্যে প্রক্রিয়া সম্পন্ন করা হবে।</li>
                            <li>৫.৪ ব্যক্তিগত বা অযৌক্তিক কারণে বাতিল করলে রিফান্ড প্রযোজ্য নয়।</li>
                        </ul>
                    </div>

                    <div className="rule-section">
                        <h6><span className="section-num">৬</span> বাতিল ও দায়</h6>
                        <ul>
                            <li>৬.১ Tutor বা Guardian-এর ব্যক্তিগত বিরোধের জন্য প্রতিষ্ঠান দায়ী নয়।</li>
                            <li>৬.২ Tutor-এর অনিয়ম বা অবহেলায় টিউশন বাতিল হলে সম্পূর্ণ দায় Tutor-এর।</li>
                            <li>৬.৩ প্রতিষ্ঠান প্রয়োজনে মধ্যস্থতা করতে পারে, তবে বাধ্য নয়।</li>
                        </ul>
                    </div>

                    <div className="rule-section">
                        <h6><span className="section-num">৭</span> নিরাপত্তা ও ঝুঁকি</h6>
                        <ul>
                            <li>৭.১ প্ল্যাটফর্ম শুধুমাত্র সংযোগ প্রদান করে; ব্যক্তিগত নিরাপত্তা সংশ্লিষ্ট পক্ষের নিজস্ব দায়িত্ব। তাই প্রথম দিনে সাক্ষাৎ করার সময় একজনকে সাথে নিয়ে যাবেন।</li>
                            <li>৭.২ কোনো প্রত্যক্ষ/পরোক্ষ ক্ষতির জন্য প্রতিষ্ঠান দায়ী থাকবে না।</li>
                        </ul>
                    </div>

                    <div className="rule-section">
                        <h6><span className="section-num">৮</span> অ্যাকাউন্ট স্থগিত/বাতিল</h6>
                        <p>শর্তাবলী লঙ্ঘন করলে প্রতিষ্ঠান পূর্ব নোটিশ ছাড়াই অ্যাকাউন্ট স্থগিত বা বাতিল করতে পারবে।</p>
                    </div>

                    <div className="rule-section">
                        <h6><span className="section-num">৯</span> নীতিমালা পরিবর্তন</h6>
                        <p>প্রতিষ্ঠান যেকোনো সময় শর্তাবলী আপডেট করতে পারবে।</p>
                    </div>

                    <div className="rule-section">
                        <h6><span className="section-num">১০</span> সম্মতি</h6>
                        <p>ওয়েবসাইট/অ্যাপ ব্যাবহার করার মাধ্যমে ব্যাবহারকারী উপরোক্ত সকল শর্তাবলী মেনে নিতে সম্মত হন।</p>
                    </div>
                </div>
            )
        },
        {
            title: "আচরণবিধি ও দায়িত্ব",
            subtitle: "Tutor Registration & Professional Code of Conduct-TSF",
            icon: <FaUserTie size={32} />,
            color: "#198754",
            content: (
                <div className="rules-content">
                    <p className="intro-text">Tuition Seba Forum-এর সাথে যুক্ত প্রত্যেক Tutor পেশাদার আচরণ ও দায়িত্বশীলতা বজায় রাখতে বাধ্য থাকবেন।</p>

                    <div className="rule-section">
                        <h6><span className="section-num">১</span> Registration</h6>
                        <ul>
                            <li>• Teacher ID ছাড়া কোনো টিউশন গ্রহণ করা যাবে না</li>
                            <li>• Teacher ID সকল যোগাযোগ ও লেনদেনের জন্য বাধ্যতামূলক</li>
                        </ul>
                    </div>

                    <div className="rule-section">
                        <h6><span className="section-num">২</span> Professional Responsibilities (বাধ্যতামূলক)</h6>
                        <p className="mb-2 fw-semibold">Tutor নিশ্চিত করবেনঃ</p>
                        <ul>
                            <li>• সময়মতো উপস্থিত থাকা</li>
                            <li>• নিয়মিত ও দায়িত্বশীলভাবে ক্লাস নেওয়া</li>
                            <li>• নির্ধারিত সময় পূর্ণ করা</li>
                            <li>• ভদ্র ও পেশাদার আচরণ বজায় রাখা</li>
                            <li>• ছাত্র/ছাত্রীর অগ্রগতিতে মনোযোগী থাকা</li>
                            <li>• টিউশনের বিস্তারিত যাচাই করে আবেদন করা</li>
                            <li>• নিজের দক্ষতার সাথে সামঞ্জস্যপূর্ণ বিষয় পড়ানো</li>
                        </ul>
                    </div>

                    <div className="rule-section">
                        <h6><span className="section-num">৩</span> Class Time Commitment</h6>
                        <ul>
                            <li>• উল্লেখিত সময় সম্পূর্ণ পড়াতে হবে</li>
                            <li>• সময় উল্লেখ না থাকলে ১.৫–২ ঘণ্টা ক্লাস নিতে হবে</li>
                            <li>• কম বা বেশি সময় পড়ানো যাবে না</li>
                        </ul>
                    </div>

                    <div className="rule-section">
                        <h6><span className="section-num">৪</span> Prohibited Conduct (কঠোরভাবে নিষিদ্ধ)</h6>
                        <ul>
                            <li>• অযৌক্তিকভাবে টিউশন বাতিল</li>
                            <li>• অনিয়মিত উপস্থিতি</li>
                            <li>• নির্ধারিত সময়ের কম পড়ানো</li>
                            <li>• ক্লাস চলাকালীন অপ্রয়োজনীয় মোবাইল ব্যবহার</li>
                            <li>• অবহেলামূলক বা ভুল পাঠদান</li>
                            <li>• অভিভাবকের সাথে অসৌজন্যমূলক আচরণ</li>
                            <li>• শর্ত পরিবর্তনের চেষ্টা</li>
                            <li>• প্ল্যাটফর্ম বাইপাস করে গোপন লেনদেন</li>
                        </ul>
                    </div>

                    <div className="rule-section">
                        <h6><span className="section-num">৫</span> Communication</h6>
                        <ul>
                            <li>• কোনো সমস্যা/বাতিল হলে অবিলম্বে প্রতিষ্ঠানকে জানাতে হবে</li>
                            <li>• প্রয়োজনে ডেমো ক্লাস দিতে সহযোগিতা করতে হবে</li>
                            <li>• টিউশন নেয়ার পরে আমাদের কল/মেসেজ এ বিরক্ত না হয়ে সহযোগিতা করতে হবে যাতে ভালো একটি সার্ভিস নিশ্চিত করতে পারি।</li>
                        </ul>
                    </div>

                    <div className="rule-section">
                        <h6><span className="section-num">৬</span> Violation & Action</h6>
                        <p className="mb-2 fw-semibold">নিয়ম ভঙ্গের ক্ষেত্রে প্রতিষ্ঠান প্রয়োজন অনুযায়ীঃ</p>
                        <ul>
                            <li>• সতর্কবার্তা</li>
                            <li>• টিউশন বাতিল</li>
                            <li>• Teacher ID স্থগিত/বাতিল</li>
                            <li>• মেম্বারশিপ বন্ধ</li>
                        </ul>
                        <p>করতে পারবে।</p>
                    </div>

                    <div className="rule-section">
                        <h6><span className="section-num">৭</span> Acceptance</h6>
                        <p>Tutor হিসেবে রেজিস্ট্রেশন করার মাধ্যমে উপরোক্ত আচরণবিধি মেনে চলতে সম্মত হন।</p>
                    </div>
                </div>
            )
        },
        {
            title: "পেমেন্ট শর্তাবলী",
            subtitle: "Payment Terms & Conditions-TSF",
            icon: <FaMoneyCheckAlt size={32} />,
            color: "#0dcaf0",
            content: (
                <div className="rules-content">
                    <p className="intro-text">Tuition Seba Forum শিক্ষক ও অভিভাবকের মধ্যে নিরাপদ ও স্বচ্ছ লেনদেন নিশ্চিত করতে একটি নির্দিষ্ট মিডিয়া ফি সিস্টেম অনুসরণ করে তাই পেমেন্ট করার পর অবশ্যই অনালাইন বা অফলাইন রশিদ বুঝে নিবেন।</p>

                    <div className="rule-section">
                        <h6>🔹 মিডিয়া ফি কাঠামো</h6>
                        <div className="fee-card mb-3">
                            <p className="fw-bold fs-5 mb-2">মোট মিডিয়া ফি: প্রথম মাসের বেতনের ৬০%</p>
                            <div className="ps-3 border-start border-primary border-4 py-2">
                                <p className="mb-2"><strong>৩০% অগ্রিম</strong> – অভিভাবকের নম্বর নেওয়ার পূর্বে</p>
                                <p className="mb-0"><strong>বাকি ৩০%</strong> – প্রথম মাসের বেতন পাওয়ার পর <span className="text-danger fw-bold">[ বেতন পাওয়ার পর বকেয়া পরিশোধ করতে হবে। কোনোভাবেই ২৪ ঘন্টার বেশি সময় নেয়া যাবে না]</span></p>
                            </div>
                        </div>
                    </div>

                    <div className="rule-section">
                        <h6>🔹 পেমেন্ট পদ্ধতি</h6>
                        <p className="mb-2 fw-semibold">অগ্রিম ও বকেয়া পরিশোধ করা যাবে:</p>
                        <ul>
                            <li>অনলাইনে বিকাশ, নগদ, রকেট থেকে</li>
                            <li>অথবা সরাসরি অফিসে এসে পেমেন্ট করলে তা অধিক নিরাপদ ও গ্রহণযোগ্য।</li>
                        </ul>
                        <div className="alert-mini">⚠️ আমাদের ওয়েবসাইট ও অ্যাপে দেওয়া অফিসিয়াল নম্বর ব্যতীত অন্য কোনো মাধ্যমে লেনদেন গ্রহণযোগ্য নয়।</div>
                    </div>

                    <div className="rule-section">
                        <h6>🔹 অগ্রিম ফি সংক্রান্ত নীতি</h6>
                        <p className="mb-2">অগ্রিম ফি প্রদান বাধ্যতামূলক। অভিভাবকের নম্বর শেয়ারের পূর্বে অগ্রিম পরিশোধ করতে হবে।</p>
                        <p className="fw-bold mb-2">অগ্রিম ফি চালুর উদ্দেশ্য:</p>
                        <ul>
                            <li>১. টিউশন কনফার্মেশন নিশ্চিত করা</li>
                            <li>২. অপ্রয়োজনীয় বাতিল বা সময় নষ্ট কমানো</li>
                            <li>৩. শিক্ষক ও প্রতিষ্ঠানের উভয়ের দায়বদ্ধতা নিশ্চিত করা</li>
                        </ul>
                    </div>

                    <div className="rule-section">
                        <h6>🔹 অগ্রিম ফি রিফান্ড</h6>
                        <p className="mb-1">টিউশন কনফার্ম না হলে বা ক্যান্সেল হলে</p>
                        <p className="mb-2">আপনার রিফান্ডের আবেদন করার সর্বোচ্চ <strong>৭২ ঘণ্টার</strong> মধ্যে যাচাই-বাছাই করে অগ্রিম টাকা ফেরত প্রদান করা হবে</p>
                        <p className="fw-bold text-success">আমরা স্বচ্ছ ও নিরাপদ লেনদেনে প্রতিশ্রুতিবদ্ধ।</p>
                    </div>

                    <div className="rule-section">
                        <h6>🔹 আমাদের বিশ্বাসযোগ্যতা</h6>
                        <p className="mb-2">Tuition Seba Forum একটি নিবন্ধিত ও বিশ্বস্ত প্ল্যাটফর্ম:</p>
                        <ul>
                            <li>১. ট্রেড লাইসেন্সপ্রাপ্ত</li>
                            <li>২. অফিস সুবিধা রয়েছে</li>
                            <li>৩. অফিসিয়াল ওয়েবসাইট ও অ্যাপ পরিচালিত</li>
                        </ul>
                        <p className="fw-bold">আমরা দীর্ঘদিন ধরে সততার সাথে সেবা প্রদান করে আসছি।</p>
                    </div>

                    <div className="rule-section">
                        <h6>সহায়তা প্রয়োজন?</h6>
                        <p>কোনো বিষয় বুঝতে অসুবিধা হলে আমাদের সাথে নির্দ্বিধায় যোগাযোগ করুন।</p>
                    </div>
                </div>
            )
        },
        {
            title: "রিফান্ড পলিসি",
            subtitle: "Refund Policy- TSF",
            icon: <FaUndoAlt size={32} />,
            color: "#ffc107",
            content: (
                <div className="rules-content">
                    <p className="intro-text">Tuition Seba Forum শিক্ষক ও অভিভাবকের মধ্যে একটি নির্ভরযোগ্য সংযোগ প্ল্যাটফর্ম। উভয় পক্ষের স্বার্থ ও ন্যায্যতা নিশ্চিত করতে নিচের নীতিমালা প্রযোজ্য।</p>

                    <div className="rule-section">
                        <h6>🔹 রিফান্ড নীতি</h6>
                        <ol className="ps-3">
                            <li className="mb-3">
                                <strong>প্রতিষ্ঠানের ভুল বা তথ্যগত অমিল থাকলে</strong><br />
                                সম্পূর্ণ মিডিয়া ফি ফেরত প্রদান করা হবে।
                            </li>
                            <li className="mb-3">
                                <strong>রিফান্ড সময়সীমা</strong><br />
                                সকল যাচাই-বাছাই শেষে সর্বোচ্চ ৭২ ঘণ্টার মধ্যে রিফান্ড সম্পন্ন করা হবে।
                            </li>
                            <li className="mb-3">
                                <strong>শিক্ষক নিজ থেকে টিউশন বাতিল করলে</strong><br />
                                বিশেষ কারণ ছাড়া রিফান্ড প্রযোজ্য হবে না। যৌক্তিক কারণ থাকলে আলোচনার মাধ্যমে সিদ্ধান্ত নেওয়া হবে।
                            </li>
                            <li className="mb-3">
                                <strong>টিউশনে ১ম দিন সাক্ষাৎ এর সময়</strong><br />
                                ছাত্র/ছাত্রী, ক্লাস, বিষয়, সময়, দিন, বেতন ও লোকেশন যাচাই করে আমাদের নিশ্চিত করবেন। সম্মতির পর অযৌক্তিক পরিবর্তন বা বাতিল করলে মিডিয়া ফি প্রযোজ্য হবে।
                            </li>
                            <li className="mb-3">
                                ডেমো ক্লাসের মাধ্যমে উভয় পক্ষ সন্তুষ্ট হলে টিউশন কনফার্ম হবে। কনফার্ম হওয়ার পর অকারণে বাতিল করা যাবে না।
                            </li>
                            <li className="mb-3">
                                <strong>কনফার্মের পর</strong><br />
                                শিক্ষক নিজ থেকে বাতিল করলে সম্পূর্ণ মিডিয়া ফি প্রযোজ্য হবে, কারণ একটি টিউশন সংগ্রহ ও কনফার্ম করতে প্রতিষ্ঠানের ব্যয় হয়।
                            </li>
                            <li className="mb-3">
                                <strong>প্রথম মাসের মধ্যে অভিভাবক বাতিল করলে</strong><br />
                                প্রদত্ত মিডিয়া ফি ফেরতযোগ্য। তবে অভিভাবক প্রদত্ত বেতনের অর্ধেক আপনি পাবেন এবং বাকি অর্ধেক আমাদের দিতে হবে সার্ভিস চার্জ হিসেবে।
                            </li>
                            <li className="mb-3">
                                <strong>প্রথম মাসের পর</strong><br />
                                টিউশন ধরে রাখা শিক্ষক-এর দায়িত্বশীলতা ও পারফরম্যান্সের উপর নির্ভরশীল। এ সময়ের পর কোনো আর্থিক অভিযোগ গ্রহণযোগ্য নয়।
                            </li>
                            <li>নিয়মিত ও সময়মতো ক্লাস নেওয়া বাধ্যতামূলক</li>
                            <li>টিউশনে পড়ানোর সময় অপ্রয়োজনীয় মোবাইল ব্যবহার নিষিদ্ধ</li>
                            <li>ভুল পাঠদান, অবহেলা বা অশোভন আচরণের প্রমাণ পাওয়া গেলে ব্যবস্থা নেওয়া হবে</li>
                            <li>বেতন/সময়/দিন পরিবর্তন বা অযৌক্তিক কারণে টিউশন বাতিল করলে</li>
                            <li>আমাদের যেসব টিউশনে ২ ঘন্টা উল্লেখ থাকে তা ২ ঘন্টা এবং যেসব টিউশনে উল্লেখ থাকেনা সেসব টিউশনে আমাদে সময় সর্বনিম্ন দেড় ঘন্টা এবং সর্বোচ্চ দুইঘন্টা সময় নিয়ে পড়াতে হবে।</li>
                        </ol>
                        <div className="alert-mini mt-3">⚠️ উপরোক্ত ৯, ১০, ১১, ১২ ও ১৩ এর কোনো রুলস না মানলে এর জন্য মিডিয়া ফি প্রযোজ্য হবে</div>
                    </div>

                    <div className="rule-section mt-4 bg-light p-3 rounded-4 border">
                        <h6 className="text-success mb-2">✅ আমাদের অঙ্গীকার</h6>
                        <p className="mb-0">আমরা ন্যায্যতা, স্বচ্ছতা এবং পেশাদার মান বজায় রেখে শিক্ষক ও অভিভাবকের জন্য নিরাপদ ও নির্ভরযোগ্য সেবা প্রদান করি। তাই আমাদের উপরোক্ত শর্তাবলীর কোনো কিছু না বুঝলে বা ব্যাখ্যার প্রয়োজন হলে আমাদের সাথে যোগাযোগ করুন।</p>
                    </div>
                </div>
            )
        }
    ];

    return (
        <>
            <NavBar />
            <div className="rules-page-wrapper">
                {/* Custom Styles for Premium Feel */}
                <style>{`
                    .rules-page-wrapper {
                        background: #f0f4f8;
                        min-height: 100vh;
                        font-family: 'Inter', sans-serif;
                    }
                    
                    /* Hero Section */
                    .rules-hero {
                        background: linear-gradient(135deg, #004085 0%, #0066cc 100%);
                        padding: 100px 0 140px;
                        position: relative;
                        color: white;
                        text-align: center;
                        overflow: hidden;
                    }
                    
                    .hero-pattern {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        opacity: 0.1;
                        background-image: radial-gradient(#fff 1px, transparent 1px);
                        background-size: 30px 30px;
                        pointer-events: none;
                    }

                    .rules-hero h1 {
                        font-weight: 800;
                        font-size: 3.5rem;
                        margin-bottom: 20px;
                        text-shadow: 0 4px 10px rgba(0,0,0,0.2);
                        animation: fadeInUp 0.8s ease-out;
                    }

                    .rules-hero p {
                        font-size: 1.25rem;
                        max-width: 800px;
                        margin: 0 auto;
                        opacity: 1;
                        font-weight: 500;
                        text-shadow: 0 2px 4px rgba(0,0,0,0.1);
                        animation: fadeInUp 1s ease-out;
                    }

                    /* Main Container */
                    .rules-container {
                        margin-top: -80px;
                        position: relative;
                        z-index: 10;
                        padding-bottom: 100px;
                    }

                    /* Glassmorphism Cards */
                    .rule-card {
                        background: rgba(255, 255, 255, 0.85);
                        backdrop-filter: blur(15px);
                        border: 1px solid rgba(255, 255, 255, 0.4);
                        border-radius: 30px;
                        padding: 40px;
                        height: 100%;
                        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.05);
                        transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
                        position: relative;
                        overflow: hidden;
                    }

                    .rule-card:hover {
                        transform: translateY(-10px);
                        box-shadow: 0 30px 60px rgba(0, 0, 0, 0.1);
                        background: rgba(255, 255, 255, 0.95);
                    }

                    .rule-card::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 6px;
                        height: 100%;
                        background: var(--card-color);
                        opacity: 0.7;
                    }

                    .icon-box {
                        width: 70px;
                        height: 70px;
                        background: var(--card-color-light);
                        color: var(--card-color);
                        border-radius: 20px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-bottom: 25px;
                        box-shadow: 0 10px 20px rgba(0,0,0,0.05);
                    }

                    .rule-card h3 {
                        font-weight: 700;
                        font-size: 1.5rem;
                        color: #1a202c;
                        margin-bottom: 5px;
                    }

                    .rule-card .subtitle {
                        font-size: 0.9rem;
                        color: #718096;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                        margin-bottom: 25px;
                        display: block;
                    }

                    /* Content Styling */
                    .rules-content {
                        color: #2d3748;
                    }

                    .intro-text {
                        font-weight: 700;
                        color: #1a202c;
                        margin-bottom: 20px;
                        line-height: 1.6;
                    }

                    .rule-section {
                        margin-bottom: 25px;
                    }

                    .rule-section h6 {
                        font-weight: 800;
                        color: #111827;
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        margin-bottom: 12px;
                    }

                    .section-num {
                        width: 24px;
                        height: 24px;
                        background: var(--card-color);
                        color: white;
                        border-radius: 6px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 0.75rem;
                        font-weight: 800;
                    }

                    .rules-content ul {
                        list-style: none;
                        padding-left: 0;
                    }

                    .rules-content li {
                        margin-bottom: 10px;
                        padding-left: 20px;
                        position: relative;
                        line-height: 1.6;
                        font-size: 1rem;
                        font-weight: 500;
                        color: #374151;
                    }

                    .rules-content li::before {
                        content: '•';
                        position: absolute;
                        left: 0;
                        color: var(--card-color);
                        font-weight: 900;
                    }

                    /* Fee and Policy Styles */
                    .fee-card {
                        background: #f8fafc;
                        border-radius: 16px;
                        padding: 1.5rem;
                        border: 1px solid #e2e8f0;
                        transition: transform 0.3s ease;
                    }

                    .fee-card:hover {
                        transform: translateY(-2px);
                    }

                    .small-text {
                        font-size: 0.85rem;
                        color: #718096;
                        font-family: inherit;
                    }

                    .alert-mini {
                        background: #fff5f5;
                        color: #c53030;
                        padding: 12px 18px;
                        border-radius: 12px;
                        font-size: 0.9rem;
                        font-weight: 600;
                        border: 1px solid #fed7d7;
                        margin-top: 1rem;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }

                    ol.ps-3 li {
                        padding-left: 10px;
                        margin-bottom: 1rem;
                    }

                    /* Support Section */
                    .support-card {
                        background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
                        border-radius: 30px;
                        padding: 40px;
                        color: white;
                        text-align: center;
                        box-shadow: 0 20px 40px rgba(0,0,0,0.15);
                        margin-top: 60px;
                    }

                    .support-btn-group {
                        display: flex;
                        justify-content: center;
                        gap: 20px;
                        margin-top: 30px;
                    }

                    .btn-support {
                        padding: 14px 30px;
                        border-radius: 15px;
                        font-weight: 700;
                        text-decoration: none;
                        transition: all 0.3s;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }

                    .btn-call { background: #0066cc; color: white; }
                    .btn-call:hover { background: #0052a3; transform: scale(1.05); }
                    .btn-ws { background: #25d366; color: white; }
                    .btn-ws:hover { background: #1eb954; transform: scale(1.05); }

                    /* Privacy Section */
                    .privacy-section {
                        margin-top: 80px;
                        background: white;
                        border-radius: 30px;
                        padding: 50px;
                        box-shadow: 0 10px 30px rgba(0,0,0,0.03);
                    }

                    @keyframes fadeInUp {
                        from { opacity: 0; transform: translateY(30px); }
                        to { opacity: 1; transform: translateY(0); }
                    }

                    @media (max-width: 768px) {
                        .rules-hero h1 { font-size: 2.5rem; }
                        .support-btn-group { flex-direction: column; }
                        .rule-card { padding: 30px; }
                    }
                `}</style>

                {/* Hero Section */}
                <div className="rules-hero">
                    <div className="hero-pattern"></div>
                    <Container>
                        <h1>Terms & Rules</h1>
                        <p>Tuition Seba Forum-এ আপনাদের স্বাগতম। স্বচ্ছতা ও পেশাদারিত্ব বজায় রাখতে আমাদের নীতিমালাগুলো একনজরে দেখে নিন।</p>
                    </Container>
                </div>

                {/* Rules Cards Container */}
                <Container className="rules-container">
                    <Row className="g-4">
                        {ruleCards.map((rule, idx) => (
                            <Col lg={6} key={idx}>
                                <div className="rule-card" style={{
                                    '--card-color': rule.color,
                                    '--card-color-light': rule.color + '15'
                                }}>
                                    <div className="icon-box">
                                        {rule.icon}
                                    </div>
                                    <h3>{rule.title}</h3>
                                    <span className="subtitle">{rule.subtitle}</span>
                                    {rule.content}
                                </div>
                            </Col>
                        ))}
                    </Row>

                    {/* Support Section */}
                    <div className="support-card">
                        <h2 className="fw-bold mb-3">সহায়তা প্রয়োজন?</h2>
                        <p className="opacity-75">আমাদের নীতিমালা নিয়ে কোনো প্রশ্ন থাকলে সরাসরি যোগাযোগ করুন</p>
                        <div className="support-btn-group">
                            <a href="tel:01633920928" className="btn-support btn-call">
                                <FaPhoneAlt /> কল করুন: 01633920928
                            </a>
                            <a href="https://wa.me/8801571305804" target="_blank" rel="noopener noreferrer" className="btn-support btn-ws">
                                <FaWhatsapp /> হোয়াটসঅ্যাপ
                            </a>
                        </div>
                    </div>

                    {/* Privacy Policy */}
                    <div className="privacy-section">
                        <div className="d-flex align-items-center gap-3 mb-4">
                            <div className="bg-primary text-white p-3 rounded-4">
                                <FaLock size={24} />
                            </div>
                            <h2 className="mb-0 fw-bold text-dark">Privacy Policy</h2>
                        </div>
                        <p className="text-muted mb-5">Last updated: {new Date().toLocaleDateString()}</p>

                        <div className="policy-content" style={{ color: '#374151', lineHeight: '1.8' }}>
                            <section className="mb-4">
                                <h5 className="fw-bold text-primary">1. Introduction</h5>
                                <p>
                                    Welcome to <strong>Tuition Seba Forum</strong>. We respect your privacy and are committed to protecting your personal data.
                                    This privacy policy will inform you as to how we look after your personal data when you visit our website or use our application
                                    and tell you about your privacy rights and how the law protects you.
                                </p>
                            </section>

                            <section className="mb-4">
                                <h5 className="fw-bold text-primary">2. Information We Collect</h5>
                                <p>
                                    We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
                                </p>
                                <ul className="ps-3 mb-3">
                                    <li className="mb-2"><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                                    <li className="mb-2"><strong>Contact Data:</strong> includes email address and telephone numbers.</li>
                                    <li className="mb-2"><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, operating system and platform.</li>
                                    <li className="mb-2"><strong>Usage Data:</strong> includes information about how you use our website, products and services (e.g., looking for tutors or students).</li>
                                </ul>
                            </section>

                            <section className="mb-4">
                                <h5 className="fw-bold text-primary">3. How We Use Your Information</h5>
                                <p>
                                    We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                                </p>
                                <ul className="ps-3 mb-3">
                                    <li className="mb-2">To register you as a new customer or tutor.</li>
                                    <li className="mb-2">To process and deliver your order including: Manage payments, fees and charges.</li>
                                    <li className="mb-2">To manage our relationship with you which will include: Notifying you about changes to our terms or privacy policy.</li>
                                    <li className="mb-2">To improve our website, products/services, marketing, customer relationships and experiences.</li>
                                </ul>
                            </section>

                            <section className="mb-4">
                                <h5 className="fw-bold text-primary">4. Data Security</h5>
                                <p>
                                    We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.
                                    In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
                                </p>
                            </section>

                            <section className="mb-4">
                                <h5 className="fw-bold text-primary">5. Data Retention</h5>
                                <p>
                                    We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements.
                                </p>
                            </section>

                            <section className="mb-4">
                                <h5 className="fw-bold text-primary">6. Your Legal Rights</h5>
                                <p>
                                    Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, restriction, transfer, to object to processing, to portability of data and (where the lawful ground of processing is consent) to withdraw consent.
                                </p>
                            </section>

                            <section className="mb-4">
                                <h5 className="fw-bold text-primary">7. Contact Us</h5>
                                <p>
                                    If you have any questions about this privacy policy or our privacy practices, please contact us at:
                                </p>
                                <div className="bg-light p-4 rounded-4" style={{ fontSize: '1rem' }}>
                                    <p className="mb-1"><strong>Tuition Seba Forum</strong></p>
                                    <p className="mb-1">No 2 Gate, Biplob Udyan, Chattogram</p>
                                    <p className="mb-1">Phone: 01633920928</p>
                                    <p className="mb-1">Email: tuitionsebaforum@gmail.com</p>
                                    <p className="mb-0"><strong>Trade License No:</strong> TRAD/CHTG/008405/2025</p>
                                </div>
                            </section>
                        </div>
                    </div>
                </Container>
            </div>
            <Footer />
        </>
    );
};

export default Rules;
