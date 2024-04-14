import React from "react";

const Terms = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold mb-6">利用規約</h1>
      <ul className="list-decimal space-y-4">
        <li>
          <h2>1. はじめに</h2>
          <p className="mt-2">
            本利用規約（以下、「本規約」といいます。）は、Read
            Scale（以下、「当アプリ」といいます。）の提供する読書管理サービス（以下、「本サービス」といいます。）の使用条件を定めるものです。ユーザーは、本サービスを使用する前に、本規約を注意深くお読みください。
          </p>
        </li>

        <li>
          <h2>2. 登録</h2>
          <ol className="list-decimal ml-6">
            <li>
              ・ユーザーは、本サービスを使用するにあたり、登録手続きを完了させるものとします。
            </li>
            <li>
              ・登録の際には正確かつ最新の情報を提供するものとし、不正確な情報が提供された場合、当アプリは利用を一時停止またはアカウントを解除することがあります。
            </li>
          </ol>
        </li>

        <li>
          <h2>3. アカウントのセキュリティ</h2>
          <p className="mt-2">
            ユーザーは自己のアカウントおよびパスワードの管理に責任を持つものとし、第三者による不正使用に対しては一切の責任を負うものとします。アカウントの不正使用を発見した場合には、直ちに当アプリに報告するものとします。
          </p>
        </li>

        <li>
          <h2>4. プライバシー</h2>
          <p className="mt-2">
            当アプリは、ユーザーからの情報収集時に最大限の注意を払い、プライバシーポリシーに則って適切に取り扱うものとします。
          </p>
        </li>

        <li>
          <h2>5. 使用権</h2>
          <ol className="list-decimal ml-6">
            <li>
              ・当アプリは、本サービスに関するすべての知的財産権を保有しています。
            </li>
            <li>
              ・ユーザーは、本サービスを私的な範囲で非商用の目的に限り使用できます。
            </li>
          </ol>
        </li>

        <li>
          <h2>6. 禁止事項</h2>
          <ol className="list-decimal ml-6">
            <li>・法令または公序良俗に違反する行為</li>
            <li>・当アプリの運営を妨げる行為</li>
            <li>・他のユーザーに迷惑をかける行為</li>
            <li>
              ・当アプリのネットワークまたはシステム等に不正アクセスする行為
            </li>
          </ol>
        </li>

        <li>
          <h2>7. 免責事項</h2>
          <p className="mt-2">
            当アプリは、本サービスの運営にあたり、可能な限り正確な情報を提供する努力を行いますが、内容の正確性、完全性、信頼性、安全性について保証するものではありません。
          </p>
        </li>

        <li>
          <h2>8. 変更と中断</h2>
          <p className="mt-2">
            当アプリは、ユーザーに通知することなく、本サービスの内容を変更または中断することがあります。これによりユーザーに発生したいかなる損害に対しても責任を負わないものとします。
          </p>
        </li>

        <li>
          <h2>9. 規約の変更</h2>
          <p className="mt-2">
            当アプリは、必要に応じて本規約を変更することがあります。変更後の規約については、本サービス上での掲示またはその他適切な方法によりユーザーに通知し、通知後の本サービスの使用をもって、変更に同意したものとみなします。
          </p>
        </li>
      </ul>
    </div>
  );
};

export default Terms;
